import React, { useEffect, useState } from "react";
import axios from "axios";

const fuzzyMatch = (a, b) => {
  if (!a || !b) return false;
  a = a.trim().toLowerCase();
  b = b.trim().toLowerCase();
  if (a === b) return true;
  const distance = levenshteinDistance(a, b);
  const threshold = Math.floor(Math.max(a.length, b.length) * 0.3);
  return distance <= threshold;
};

const levenshteinDistance = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
};

const Girah = () => {
  const [lineFromAPI, setLineFromAPI] = useState("");
  const [userInput, setUserInput] = useState("");
  const [matchCount, setMatchCount] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const fetchRandomLine = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/girah/girah"); // Use your actual backend port here
      setLineFromAPI(res.data.line);
      setUserInput("");
      setMatchCount(null);
      setShowResult(false);
    } catch (error) {
      console.error("Error fetching couplet line:", error);
    }
  };
  
  useEffect(() => {
    fetchRandomLine();
  }, []);

  const handleSubmit = () => {
    const userWords = userInput.trim().split(/\s+/);
    const apiWords = lineFromAPI.trim().split(/\s+/);
  
    const userLast3 = userWords.slice(-3);
    const apiLast3 = apiWords.slice(-3);
  
    let matches = 0;
  
    // Match last letter of third-last word
    if (userLast3[0] && apiLast3[0]) {
      const userChar = userLast3[0].slice(-1);
      const apiChar = apiLast3[0].slice(-1);
      if (userChar === apiChar) matches++;
    }
  
    // Fuzzy match for last 2 words
    for (let i = 1; i < 3; i++) {
      if (fuzzyMatch(userLast3[i], apiLast3[i])) matches++;
    }
  
    setMatchCount(matches);
    setShowResult(true);
  };
  

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Match the Couplet Line</h1>
      <p className="text-xl mb-4 text-purple-700 font-medium">"{lineFromAPI}"</p>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter your second line..."
      />

      <button onClick={handleSubmit} className="mb-4">Check Match</button>

      {showResult && (
        <div className="mb-4">
          <p className="text-lg">Matched Words: <span className="font-semibold">{matchCount}</span> / 3</p>
        </div>
      )}

      <button onClick={fetchRandomLine} variant="outline">Play Again</button>
    </div>
  );
};

export default Girah;
