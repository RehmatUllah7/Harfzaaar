from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import numpy as np

# Load model
print("Loading SentenceTransformer model...")
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print("✅ Model loaded successfully!")

# Connect to MongoDB
print("Connecting to MongoDB...")
client = MongoClient("mongodb://localhost:27017/")
db = client["harfzaar"]
collection = db["qaafia_words"]
print("Connected to MongoDB!")

# Fetch all words
print("Fetching words from MongoDB...")
words_data = list(collection.find({}, {"_id": 1, "word": 1}))
print(f"Fetched {len(words_data)} words.")

# Batch processing
batch_size = 500  # Adjust if needed
total_words = len(words_data)

print(f"Starting batch processing ({batch_size} words per batch)...")

for i in range(0, total_words, batch_size):
    batch = words_data[i : i + batch_size]

    # Extract words
    words = [entry["word"] for entry in batch]

    print(f"Encoding {len(words)} words (Batch {i // batch_size + 1})...")
    embeddings = model.encode(words, convert_to_numpy=True).tolist()
    print("Encoding complete!")

    # Store embeddings in MongoDB
    for j, entry in enumerate(batch):
        collection.update_one({"_id": entry["_id"]}, {"$set": {"embedding": embeddings[j]}})

    print(f"{i + len(batch)}/{total_words} words processed and stored.")

print("All embeddings stored successfully!")
