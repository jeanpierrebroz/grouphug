import pandas as pd
from sentence_transformers import SentenceTransformer, util
from pinecone import Pinecone

pc = Pinecone()
model = SentenceTransformer("msmarco-distilbert-dot-v5")

query_embedding = model.encode("How big is London")