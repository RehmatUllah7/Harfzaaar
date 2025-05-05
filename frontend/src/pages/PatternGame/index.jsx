import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const PatternGame = () => {
  const navigate = useNavigate();
  const [line, setLine] = useState("");
  const [words, setWords] = useState([]);
  const [correctPattern, setCorrectPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timer, setTimer] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval;
    if (startTime && !endTime) {
      interval = setInterval(() => {
        setTimer(((Date.now() - startTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const shuffleArray = (array) => {
    return array
      .map((val) => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ val }) => val);
  };

  const fetchLine = async () => {
    const res = await axios.get("http://localhost:5000/api/girah/girah");
    const line = res.data.line;
    const wordList = line.trim().split(/\s+/);

    setLine(line);
    setCorrectPattern(wordList);
    setWords(shuffleArray([...wordList]));
    setUserPattern([]);
    setStatusMap({});
    setStartTime(Date.now());
    setEndTime(null);
    setTimer(0);
  };

  useEffect(() => {
    fetchLine();
  }, []);

  const handleWordClick = (word, index) => {
    if (statusMap[index] === "correct") return;

    const newStatusMap = { ...statusMap };
    for (let key in newStatusMap) {
      if (newStatusMap[key] === "wrong") {
        delete newStatusMap[key];
      }
    }

    const expectedWord = correctPattern[userPattern.length];
    const isCorrect = word === expectedWord;

    newStatusMap[index] = isCorrect ? "correct" : "wrong";
    setStatusMap(newStatusMap);

    if (isCorrect) {
      const newUserPattern = [...userPattern, word];
      setUserPattern(newUserPattern);

      if (newUserPattern.length === correctPattern.length) {
        setEndTime(Date.now());
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden p-4 flex items-center justify-center">
      {/* Floating background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-900 opacity-10"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 120 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% / 60%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 flex items-center text-white hover:text-purple-300 transition-colors group"
      >
        <FiArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform" size={20} />
        <span className="font-medium">Back</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
        {/* Timer Display */}
        <div className="absolute top-4 right-4 bg-purple-900/30 text-white px-3 py-1 rounded-full text-sm">
          ⏱ {timer}s
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Rebuild the Line
        </h2>

        {/* Word Bubbles */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {words.map((word, idx) => (
            <button
              key={idx}
              className={`px-5 py-3 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                statusMap[idx] === "correct"
                  ? "bg-green-500/90 border-green-400 text-white shadow-lg shadow-green-500/20"
                  : statusMap[idx] === "wrong"
                  ? "bg-red-500/90 border-red-400 text-white shadow-lg shadow-red-500/20"
                  : "bg-white/10 border-purple-400/30 text-white hover:bg-white/20 hover:border-purple-400/50 shadow-lg shadow-purple-500/10"
              }`}
              onClick={() => handleWordClick(word, idx)}
            >
              <span className="text-lg font-medium">{word}</span>
            </button>
          ))}
        </div>

        {/* User's Pattern */}
        <div className="mb-8 p-4 bg-purple-900/20 rounded-xl border border-purple-400/30 min-h-20">
          <h3 className="text-lg font-semibold text-purple-200 mb-2">Your Pattern:</h3>
          <div className="text-2xl font-urdu text-white">
            {userPattern.length > 0 ? userPattern.join(" ") : "..."}
          </div>
        </div>

        {/* Completion Message */}
        {userPattern.length === correctPattern.length && (
          <div className="mt-6 text-center bg-green-900/20 rounded-2xl p-6 border border-green-400/30">
            <p className="text-2xl font-bold text-green-400 mb-2 flex items-center justify-center">
              <span className="mr-2">✅</span> Line Completed!
            </p>
            <p className="text-purple-200 mb-4">
              Time: {timer} seconds
            </p>
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
              onClick={fetchLine}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PatternGame;