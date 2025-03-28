import pymongo
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import pickle

print("Starting indexing script...")

# Load Sentence Transformer Model
print("Loading Sentence Transformer Model...")
model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L6-v2')
# Connect to MongoDB
print("Connecting to MongoDB...")
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["harfzaar"]
collection = db["ghazals"]

# Fetch Ghazals from MongoDB
print("Fetching Ghazals from MongoDB...")
ghazals = list(collection.find({}, {"_id": 1, "poetryTitle": 1, "poetryContent": 1}))

if not ghazals:
    print("No ghazals found in the database!")
    exit()

# Extract text and convert to embeddings
print(f"Found {len(ghazals)} ghazals. Creating embeddings...")
texts = [ghazal["poetryTitle"] + " " + ghazal["poetryContent"] for ghazal in ghazals]
embeddings = model.encode(texts, convert_to_numpy=True)

# Store _id for reference
ghazal_ids = [str(ghazal["_id"]) for ghazal in ghazals]

# Initialize FAISS Index
d = embeddings.shape[1]
print(f"Initializing FAISS Index with dimension {d}...")
index = faiss.IndexFlatL2(d)
index.add(embeddings)

# Save FAISS Index and Ghazal IDs
print("Saving FAISS index and Ghazal IDs...")
faiss.write_index(index, "ghazal_faiss.index")
with open("ghazal_ids.pkl", "wb") as f:
    pickle.dump(ghazal_ids, f)

print("Ghazals indexed successfully!")
