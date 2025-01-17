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


def llmResponse(sources):
    
    prompt = ""
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
        vector=[0.1, 0.3],
    top_k=6,
    include_values=True,
    include_metadata=True,
    filter={"type": {"$eq": "person"}}
    )

    for r in results['matches']:
        






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

class Source(BaseModel):
    title: str
    description: str

class QueryResponse(BaseModel):
    query: str
    response: str
    sources: List[Source]

@app.post("/query", response_model=QueryResponse)
async def handle_query(query: Query):
    # Dummy response and sources
    response = f"This is a dummy response for the query: {query.text}"
    sources = [
        Source(title=f"Source {i}", description=f"Description for source {i}")
        for i in range(1, 9)
    ]
    return QueryResponse(query=query.text, response=response, sources=sources)

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