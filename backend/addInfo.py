import pandas as pd
from sentence_transformers import SentenceTransformer, util
from pinecone import Pinecone
from dotenv import dotenv_values
config = dotenv_values()

pc = Pinecone(config['PINECONE'])
index = pc.Index('hackathon')
df = pd.read_csv('data.csv')


model = SentenceTransformer("msmarco-bert-base-dot-v5")

def vectormagic(query: str):
    temp = model.encode(query)
    res = []
    for i in temp:
        res.append(float(i))
    return res

for i in range(len(df)):
    row = df.loc[i]
    desc = row['Description']
    name = row['Name']
    t = row['Type']
    vec = vectormagic(desc)
    index_stats = index.describe_index_stats()
    print(i)
    total_vector_count = index_stats.total_vector_count
    index.upsert(vectors = [{"values" : vec, "id": f"vec{i}", "metadata" : {'Name' : name, 'Description' : desc, "Type" : t}}])
