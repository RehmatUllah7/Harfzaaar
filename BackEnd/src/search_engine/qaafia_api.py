from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import numpy as np
import json

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load Sentence Transformer model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["harfzaar"]
collection = db["qaafia_words"]

def find_matching_suffix(word1, word2):
    """Find the longest common suffix between two words."""
    min_length = min(len(word1), len(word2))
    for i in range(min_length):
        if word1[-(i + 1)] != word2[-(i + 1)]:
            return word1[-i:] if i > 0 else ""
    return word1[-min_length:]

@app.route('/qaafiaSearch', methods=['GET'])
def search_words():
    first_qaafia = request.args.get('firstQaafia', '')
    second_qaafia = request.args.get('secondQaafia', '')

    if not first_qaafia or not second_qaafia:
        return jsonify({"error": "Both Qaafia words are required"}), 400

    try:
        # Step 1: Extract the matching ravi pattern (suffix)
        ravi_pattern = find_matching_suffix(first_qaafia, second_qaafia)
        if not ravi_pattern:
            return jsonify({"error": "No common ravi pattern found"}), 400

        # Get total documents in the collection
        total_documents = collection.count_documents({})
        print(f"Total Documents in Collection: {total_documents}")

        # Step 2: Search words in MongoDB based on ravi pattern
        regex_pattern = f"{ravi_pattern}$"  # Match words ending with the ravi pattern
        matching_words_data = list(collection.find(
            {
                "$or": [
                    {"ravi1": {"$regex": regex_pattern, "$options": "i"}},
                    {"ravi2": {"$regex": regex_pattern, "$options": "i"}},
                    {"ravi3": {"$regex": regex_pattern, "$options": "i"}}
                ]
            },
            {"word": 1, "embedding": 1, "_id": 0}
        ))

        total_matched_words = len(matching_words_data)
        print(f"Total Matched Words: {total_matched_words}")

        if not matching_words_data:
            return jsonify({"error": "No matching words found in the database"}), 404

        # Step 3: Compare these words with the first Qaafia using the model
        first_qaafia_embedding = model.encode(first_qaafia, convert_to_numpy=True)

        words = [entry["word"] for entry in matching_words_data]
        word_embeddings = np.array([entry["embedding"] for entry in matching_words_data])

        # Compute cosine similarity
        norms = np.linalg.norm(word_embeddings, axis=1) * np.linalg.norm(first_qaafia_embedding)
        similarity_scores = np.dot(word_embeddings, first_qaafia_embedding) / np.where(norms == 0, 1, norms)

        # Step 4: Rank and return top matches
        word_scores = {word: score for word, score in zip(words, similarity_scores)}
        sorted_matches = sorted(word_scores.items(), key=lambda x: x[1], reverse=True)
        top_matches = [{"word": word, "score": round(float(score), 6)} for word, score in sorted_matches[:9]]

        print("Top 9 Words with Scores:")
        for word_entry in top_matches:
            print(f"{word_entry['word']}: {word_entry['score']}")

        return app.response_class(
            response=json.dumps({"raviPattern": ravi_pattern, "matches": top_matches}, ensure_ascii=False),
            mimetype="application/json"
        )
    except Exception as e:
        print(f"Error in /qaafiaSearch: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
