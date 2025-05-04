import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SukhanAlfaz = () => {
  const [words, setWords] = useState([]);
  const [couplet, setCouplet] = useState('');
  const [matchCount, setMatchCount] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchWords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sukhan');
      setWords(res.data.words);
      setCouplet('');
      setMatchCount(null);
      setSubmitted(false);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const coupletNormalized = couplet.replace(/\s/g, '').trim();
    let count = 0;

    words.forEach(word => {
      if (coupletNormalized.includes(word)) {
        count += 1;
      }
    });

    setMatchCount(count);
    setSubmitted(true);
  };

  const getScoreText = () => {
    switch (matchCount) {
      case 0: return '❌ 0 words matched. Score: 0';
      case 1: return '✅ 1 word matched. Score: 20';
      case 2: return '✅✅ 2 words matched. Score: 40';
      case 3: {
        const randomScore = Math.floor(Math.random() * 51) + 50; // 50–100
        return `🎯 All 3 matched! Score: ${randomScore}`;
      }
      default: return '';
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4 text-center">🎮 Word Matching Game</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Your Words:</h3>
        <ul className="flex gap-4 justify-center text-xl text-purple-700">
          {words.map((word, index) => (
            <li key={index}>👉 {word}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={couplet}
          onChange={(e) => setCouplet(e.target.value)}
          placeholder="اپنا اردو شعر یہاں لکھیں..."
          className="w-full p-2 border rounded text-right font-notoUrdu"
          rows={3}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {submitted && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-green-700">{getScoreText()}</p>
          <button
            onClick={fetchWords}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            🔁 Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SukhanAlfaz;
