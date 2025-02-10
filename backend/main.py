from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util
from openai import OpenAI
from pinecone import Pinecone
from dotenv import dotenv_values
import requests
import base64
import os
import logging
from google import genai

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

config = dotenv_values()

# Define cache directory
cache_dir = os.path.join(os.path.dirname(__file__), "model_cache")
os.makedirs(cache_dir, exist_ok=True)

# Initialize model variable but don't load it immediately
sentence_transformer = None

def get_sentence_transformer():
    global sentence_transformer
    if sentence_transformer is None:
        logger.info(f"Loading model from/to cache directory: {cache_dir}")
        sentence_transformer = SentenceTransformer("msmarco-bert-base-dot-v5", cache_folder=cache_dir)
        logger.info("Model loaded successfully")
    return sentence_transformer

pc = Pinecone(config['PINECONE'])
index = pc.Index('hackathon')

def vectormagic(query: str):
    temp = get_sentence_transformer().encode(query)
    res = []
    for i in temp:
        res.append(float(i))
    return res

def llmResponse(sources, queryington):
    
    ppl = ""
    proj = ""
    for i in range(6):
        ppl+=f"ID: {i+1} TITLE: {sources[i]['metadata']['Name']} NAME: {sources[i]['metadata']['Description']}"
    
    for i in range(6,8):
        proj+=f"ID: {i+1} TITLE: {sources[i]['metadata']['Name']} NAME: {sources[i]['metadata']['Description']}"

    prompt = f'''You are an expert at finding people relevant to a user's query. You will be given 6 people and 2 projects, and depending on whether the query pertains to a person or project you will repsond accordingly.
    You will give a summary of what you find, and cite the source using the corresponding source ID. You must keep your responses brief, but mention all relevant people. Don't ramble. Here is the query: {queryington}


    Here are the PEOPLE: {ppl}

    Here are the PROJECTS: {proj}



    '''
    # NVIIDA STUFF
    # client = OpenAI(
    # base_url = "https://integrate.api.nvidia.com/v1",
    # api_key = config['NVIDIA']
    # )

    # completion = client.chat.completions.create(
    # model="meta/llama-3.1-405b-instruct",
    # messages=[{"role":"user","content":prompt}],
    # temperature=0.01,
    # top_p=0.7,
    # max_tokens=1024,
    # stream=False
    # )

    # return completion.choices[0].message.content

    # GEMINI STUFF
    client = genai.Client(api_key=config['GEMINI'])
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt)
    return response.text

def get_sources(query: str):

    vec = vectormagic(query)
    res = []
    results = index.query(
    vector=vec,
    top_k=6,
    include_values=True,
    include_metadata=True,
    filter={"Type": {"$eq": "Person"}}
    )


    for r in results['matches']:
        res.append(r)

    results = index.query(
    vector=vec,
    top_k=2,
    include_values=True,
    include_metadata=True,
    filter={"Type": {"$eq": "Project"}}
    )

    for r in results['matches']:
        res.append(r)
    return res

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for people and projects
people: List[str] = []
projects: List[str] = []

class Query(BaseModel):
    text: str

class Person(BaseModel):
    name: str
    description: str
    resumeDescription: str
class Project(BaseModel):
    name: str
    description: str
    githubUrl: str
    githubName: str

# class Source(BaseModel):
#     title: str
#     description: str

# class QueryResponse(BaseModel):
#     query: str
#     response: str
#     sources: List[Source]

@app.post("/query")
async def handle_query(query: Query):
    # Dummy response and sources
    sources = get_sources(query.text)

    response = llmResponse(sources, query)
    # response = ""

    final = []
    for src in sources:
        temp = {'title' : src['metadata']['Name'], 'description' : src['metadata']['Description']}
 
        final.append(temp)
    # print(final)
    print(len(final), final)



    return {'query' : query.text, 'response' : response, 'sources' : final}

@app.post("/add_person")
async def add_person(person: Person):
    # If the description is very long, it's likely a resume that needs processing
    if len(person.resumeDescription) > 0:  # Arbitrary threshold to detect resume content
        print("RESUME DESCRIPTION: ", person.resumeDescription)
        prompt = f'''
            I will give you a resume. Please create a concise description of the person's skills, experience, and background.
            Focus on their technical abilities, projects, and achievements. Keep it brief but informative.
            Resume: <{person.resumeDescription}>
        '''
        
        # GEMINI STUFF
        client = genai.Client(api_key=config['GEMINI'])
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt)
        
        # Update description with processed resume content
        person.description = response.text

    vec = vectormagic(person.description)
    index_stats = index.describe_index_stats()
    total_vector_count = index_stats.total_vector_count
    index.upsert(vectors = [{"values" : vec, "id": f"vec{total_vector_count+5}", "metadata" : {'Name' : person.name, 'Description' : person.description, "Type" : "Person"}}])
    return {"message": "Person added successfully"}

@app.post("/add_project")
async def add_project(project: Project):
    if project.githubUrl == "":
        vec = vectormagic(project.description)
        index_stats = index.describe_index_stats()
        total_vector_count = index_stats.total_vector_count
        index.upsert(vectors = [{"values" : vec, "id": f"vec{total_vector_count+5}", "metadata" : {'Name' : project.name, 'Description' : project.description, "Type" : "Project"}}])
        return {"message": "Project added successfully"}
    else:
        repo_url = project.githubUrl
        parts = repo_url.rstrip("/").split("/")
        if len(parts) < 2:
            raise ValueError("Invalid GitHub repository URL")
        owner, repo = parts[-2], parts[-1]

        # GitHub API URL for README
        api_url = f"https://api.github.com/repos/{owner}/{repo}/readme"

        # Make the API request
        response = requests.get(api_url, headers={"Accept": "application/vnd.github.v3+json"})

        if response.status_code == 200:
            # Decode README content from base64
            readme_data = response.json()
            content = requests.utils.unquote(readme_data.get("content", ""))
            readme_content = base64.b64decode(readme_data['content']).decode('utf-8')
            print("README content:")
            print(readme_content)




        readMe = ""
        prompt = f'''
            Following I will give you a readMe for a GitHub repository. Issolate the description of the project and ONLY return what the description of the project is.
            Do not say that you are writing a description, just return the description.
            Also state the team members that were involved in the projects and their emails, and say the team members in a sentence, rather than bullet points.
            readMe: <{readme_content}>
        '''
        #NVIDIA STUFF
        # client = OpenAI(
        # base_url = "https://integrate.api.nvidia.com/v1",
        # api_key = config['NVIDIA']
        # )

        # completion = client.chat.completions.create(
        # model="meta/llama-3.1-405b-instruct",
        # messages=[{"role":"user","content":prompt}],
        # temperature=0.01,
        # top_p=0.7,
        # max_tokens=1024,
        # stream=False
        # )

        # GEMINI STUFF
        client = genai.Client(api_key=config['GEMINI'])
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt)


        print(response.text)
        project.description = response.text
        project.name = project.githubName

        vec = vectormagic(project.description)
        index_stats = index.describe_index_stats()
        total_vector_count = index_stats.total_vector_count
        index.upsert(vectors = [{"values" : vec, "id": f"vec{total_vector_count+5}", "metadata" : {'Name' : project.name, 'Description' : project.description, "Type" : "Project"}}])
        return {"message": "Project added successfully"}



@app.get("/people")
async def get_people():
    return {"people": people}

@app.get("/projects")
async def get_projects():
    return {"projects": projects}

@app.get("/get_all_people")
async def get_all_people(skip: int = 0, limit: int = 20):
    results = index.query(
        vector=[0.0] * 768,  # Dummy vector to get all results
        top_k=100,
        include_metadata=True,
        filter={"Type": {"$eq": "Person"}},
    )
    
    people = []
    # if skip>0:
    #     skip = skip + 1
    for match in results['matches']:
        people.append({
            'name': match['metadata']['Name'],
            'description': match['metadata']['Description']
        })
    
    return {"people": people}

@app.get("/get_all_projects")
async def get_all_projects(skip: int = 0, limit: int = 20):
    results = index.query(
        vector=[0.0] * 768,  # Dummy vector to get all results
        top_k=100,  # Get all results up to skip + limit
        include_metadata=True,
        filter={"Type": {"$eq": "Project"}},
    )
    
    projects = []
    # Only take the slice we want after skipping
    for match in results['matches']:
        projects.append({
            'name': match['metadata']['Name'],
            'description': match['metadata']['Description']
        })
    
    return {"projects": projects}

if __name__=="__main__":
    print("bruh")