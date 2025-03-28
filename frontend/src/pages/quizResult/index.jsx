import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, total = 0, quizData = [] } = location.state || { score: 0, total: 0, quizData: [] };

  const [displayScore, setDisplayScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Animated score reveal
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < score) {
        count++;
        setDisplayScore(count);
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [score]);

  // Determine ranking badge
  const getBadge = () => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "🥇 Gold Medalist!";
    if (percentage >= 50) return "🥈 Silver Achiever!";
    return "🥉 Bronze Learner!";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-purple-900 min-h-screen text-white flex flex-col items-center justify-center relative">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-[120px]"></div>

      {/* Results Card */}
      <div className="relative bg-white/10 backdrop-blur-lg px-10 py-12 rounded-3xl shadow-xl border border-white/20 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-lg mb-6">
          🎉 Quiz Completed!
        </h1>

        {/* Animated Score Display */}
        <p className="text-2xl font-bold text-green-400 drop-shadow-lg mb-3">
          You scored: <span className="text-yellow-400">{displayScore}</span> /{" "}
          <span className="text-purple-400">{total}</span>
        </p>

        {/* Badge / Achievement */}
        <p className="text-lg font-semibold text-gray-300">{getBadge()}</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
          >
            {showDetails ? "Hide Details" : "📜 Show Details"}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-700 transition-all"
          >
            🔙 Go Back
          </button>
        </div>
      </div>

      {/* Details Section (Correct Answers) */}
      {showDetails && (
        <div className="bg-white/10 backdrop-blur-lg px-6 py-8 rounded-3xl shadow-xl border border-white/20 max-w-3xl mx-auto mt-10 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">📜 Quiz Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-gray-500 text-white">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="py-2 px-4 border border-gray-500">Question</th>
                  <th className="py-2 px-4 border border-gray-500">Your Answer</th>
                  <th className="py-2 px-4 border border-gray-500">Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {quizData.map((item, index) => (
                  <tr key={index} className="border border-gray-500">
                    <td className="py-2 px-4 border border-gray-500">{item.question}</td>
                    <td
                      className={`py-2 px-4 border border-gray-500 ${
                        item.userAnswer === item.correctAnswer
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.userAnswer}
                    </td>
                    <td className="py-2 px-4 border border-gray-500 text-yellow-400">
                      {item.correctAnswer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
