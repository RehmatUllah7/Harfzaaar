import Header from "@/components/home/Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuizLandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/quiz/start-quiz");
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched Questions:", data.questions);
        navigate("/quizpages", { state: { questions: data.questions } });
      } else {
        alert("Failed to fetch quiz questions. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-purple-900 min-h-screen text-white relative overflow-hidden">
      <Header />

      {/* Glowing Gradient Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-[120px]"></div>

      {/* Hero Section */}
      <div
        className={`flex flex-col items-center justify-center min-h-screen text-center transition-opacity duration-1000 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Glassmorphic Card */}
        <div className="bg-white/10 backdrop-blur-lg px-10 py-12 rounded-3xl shadow-xl border border-white/20 max-w-lg mx-auto">
          <h1 className="text-5xl font-extrabold text-purple-400 mb-4 drop-shadow-lg tracking-wide">
            Harfzaar Quiz
          </h1>
          <p className="text-lg text-gray-300 font-light leading-relaxed">
            Dive into the world of <strong className="text-purple-300">Urdu poetry, prose, and literary heritage</strong>  
            with engaging and thought-provoking questions.
          </p>
          <p className="text-md italic text-gray-400 mt-2 mb-6 tracking-widest">
            "Where every question unveils a new poetic journey"
          </p>

          {/* Animated Start Button */}
          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className={`relative px-10 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-500/50 hover:scale-105"
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="relative z-10">Start Quiz</span>
            )}

            {/* Glowing Effect */}
            {!loading && (
              <span className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizLandingPage;
