from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize empty lists for people and projects
people = []
projects = []

class Person(BaseModel):
    name: str
    description: str

class Project(BaseModel):
    name: str
    description: str

class QueryResponse(BaseModel):
    query: str
    response: str
    sources: List[dict]

@app.post("/query")
async def process_query(query: str):
    # Dummy response and sources
    response = f"This is a dummy response for: {query}"
    sources = [
        {"title": f"Source {i}", "description": f"Description for source {i}"}
        for i in range(1, 9)
    ]
    return QueryResponse(query=query, response=response, sources=sources)

@app.post("/add_person")
async def add_person(person: Person):
    people.append(f"{person.name}: {person.description}")
    return {"message": "Person added successfully"}

@app.post("/add_project")
async def add_project(project: Project):
    projects.append(f"{project.name}: {project.description}")
    return {"message": "Project added successfully"}

