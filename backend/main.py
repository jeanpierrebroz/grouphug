from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util
from openai import OpenAI
from pinecone import Pinecone
from dotenv import dotenv_values

config = dotenv_values()

model = SentenceTransformer("msmarco-bert-base-dot-v5")

pc = Pinecone(config['PINECONE'])
index = pc.Index('hackathon')



def vectormagic(query: str):
    temp = model.encode(query)
    res = []
    for i in temp:
        res.append(float(i))
    return res


def llmResponse(sources, queryington):
    
    ppl = ""
    proj = ""
    prompt = f'''You are an expert at finding people relevant to a user's query. You will be given 6 people and 2 projects, and depending on whether the query pertains to a person or project you will repsond accordingly.
    You will give a summary of what you find, and cite the source using the corresponding source ID. You must keep your responses brief, but mention all relevant people. Don't ramble. Here is the query: {queryington}


    Here are the PEOPLE: {ppl}

    Here are the PROJECTS: {proj}



    '''
    client = OpenAI(
    base_url = "https://integrate.api.nvidia.com/v1",
    api_key = config['NVIDIA']
    )

    completion = client.chat.completions.create(
    model="meta/llama-3.1-405b-instruct",
    messages=[{"role":"user","content":prompt}],
    temperature=0.01,
    top_p=0.7,
    max_tokens=1024,
    stream=False
    )

    return completion.choices[0].message.content




def get_sources(query: str):

    vec = vectormagic(query)
    res = []
    results = index.query(
        vector=vec,
    top_k=6,
    include_values=False,
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

class Project(BaseModel):
    name: str
    description: str

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

    response = llmResponse(sources)
    # response = ""

    final = []
    for src in sources:
        temp = {src['metadata']['Name'], src['metadata']['Description']}
 
        final.append(temp)
    # print(final)



    return {'query' : query.text, 'response' : response, 'sources' : final}

@app.post("/add_person")
async def add_person(person: Person):
    people.append(f"{person.name}: {person.description}")
    return {"message": "Person added successfully"}

@app.post("/add_project")
async def add_project(project: Project):

    return {"message": "Project added successfully"}

@app.get("/people")
async def get_people():
    return {"people": people}

@app.get("/projects")
async def get_projects():
    return {"projects": projects}

if __name__=="__main__":
    print("bruh")