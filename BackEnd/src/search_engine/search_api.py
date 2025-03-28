from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import faiss
import pickle
from bson import ObjectId
import numpy as np
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import json

# Load FAISS index and Ghazal IDs
index = faiss.read_index("ghazal_faiss.index")
with open("ghazal_ids.pkl", "rb") as f:
    ghazal_ids = pickle.load(f)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["harfzaar"]
collection = db["ghazals"]

# Load Sentence Transformer Model
model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L6-v2')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow all frontend requests

def clean_text(text):
    """Removes unwanted newlines and extra spaces from text."""
    return text.replace("\n", " ").strip()

@app.route('/', methods=['GET'])
def search_ghazal():
    query = request.args.get('query', '')
    
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    # Convert query to embedding
    query_embedding = model.encode([query], convert_to_numpy=True)
    
    # Search in FAISS index
    D, I = index.search(query_embedding, 10)  # Fetch more results initially

    # Retrieve matching Ghazals
    unique_results = {}  # Use a dictionary to store unique results

    for idx in I[0]:
        if idx < 0:
            continue
        
        try:
            ghazal_id = str(ghazal_ids[idx])  # Ensure it's a valid string
            ghazal = collection.find_one({"_id": ObjectId(ghazal_id)})
            
            if ghazal:
                poetry_title = ghazal.get("poetryTitle", "Untitled")
                poetry_content = ghazal.get("poetryContent", "No Content Available")

                # Ensure uniqueness based on title
                if poetry_title not in unique_results:
                    unique_results[poetry_title] = {
                        "poetryTitle": poetry_title,
                        "poetryContent": poetry_content
                    }

                # Stop if we have 5 unique results
                if len(unique_results) >= 5:
                    break

        except Exception as e:
            print(f"Error retrieving Ghazal for ID {ghazal_id}: {e}")
            continue

    # Convert dictionary values to a list
    results = list(unique_results.values())

    # Pretty print JSON response
    return Response(
        json.dumps(results, ensure_ascii=False, indent=4),
        mimetype='application/json'
    )

if __name__ == '__main__':
    app.run(debug=True)
