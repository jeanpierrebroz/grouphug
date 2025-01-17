from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util
from openai import OpenAI

model = SentenceTransformer("msmarco-bert-base-dot-v5")




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
    api_key = "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"
    )

    completion = client.chat.completions.create(
    model="meta/llama-3.1-405b-instruct",
    messages=[{"role":"user","content":prompt}],
    temperature=0.01,
    top_p=0.7,
    max_tokens=1024,
    stream=False
    )

    return completion.choices[0].


    pass




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
    projects.append(f"{project.name}: {project.description}")
    return {"message": "Project added successfully"}

@app.get("/people")
async def get_people():
    return {"people": people}

@app.get("/projects")
async def get_projects():
    return {"projects": projects}

if __name__=="__main__":
    print("bruh")