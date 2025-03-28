import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions?.questions || [];
  const totalTime = 60; // Total quiz time

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [reviewingSkipped, setReviewingSkipped] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });

    if (option === currentQuestion.answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Delay before moving to the next question
    setTimeout(() => {
      if (!reviewingSkipped) {
        goToNextQuestion();
      }
    }, 500); // 500ms delay
  };

  const goToNextQuestion = () => {
    if (reviewingSkipped) {
      // If reviewing skipped questions, navigate to the next skipped question
      if (skippedQuestions.length > 0) {
        setCurrentIndex(skippedQuestions[0]);
        setSkippedQuestions((prev) => prev.slice(1));
      } else {
        // No more skipped questions, submit the quiz
        handleSubmitQuiz();
      }
    } else if (currentIndex < questions.length - 1) {
      // Normal navigation to the next question
      setCurrentIndex(currentIndex + 1);
    } else if (skippedQuestions.length > 0) {
      // Start reviewing skipped questions
      setCurrentIndex(skippedQuestions[0]);
      setSkippedQuestions((prev) => prev.slice(1));
      setReviewingSkipped(true);
    }
  };

  const handleSkipQuestion = () => {
    if (!selectedAnswers.hasOwnProperty(currentIndex)) {
      setSkippedQuestions([...skippedQuestions, currentIndex]);
    }
    goToNextQuestion();
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const quizData = questions.map((question, index) => ({
      question: question.question,
      userAnswer: selectedAnswers[index] || "Skipped",
      correctAnswer: question.answer,
    }));
  
    navigate("/quizresults", { state: { score, total: questions.length, quizData } });
  };

  // Check if all questions are answered (not skipped)
  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-purple-900 min-h-screen text-white flex flex-col items-center justify-center">
      <div className="relative bg-white/10 backdrop-blur-lg px-10 py-12 rounded-3xl shadow-xl border border-white/20 max-w-2xl mx-auto text-center">
        {/* Timer */}
        <div className="absolute top-4 right-4 text-lg font-semibold bg-gray-800 px-4 py-2 rounded-full">
          ⏳ {timeLeft}s
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-purple-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Display */}
        <h2 className="text-3xl font-extrabold text-purple-400 mb-3">
          Question {currentIndex + 1}
        </h2>

        <p className="text-lg text-gray-200 font-light leading-relaxed mb-6">
          {currentQuestion.question}
        </p>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentIndex] === option;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-lg text-left transition-all text-lg font-medium
                  ${isSelected ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}
                `}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {/* Previous Button */}
          <button
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0}
            className="bg-gray-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            Previous
          </button>

          {/* Submit Quiz or Next Button */}
          {allQuestionsAnswered ? (
            // Submit Quiz Button (when all questions are answered)
            <button
              onClick={handleSubmitQuiz}
              className="bg-red-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition-all"
            >
              Submit Quiz
            </button>
          ) : (
            // Skip or Next Button (when not all questions are answered)
            <>
              {!selectedAnswers.hasOwnProperty(currentIndex) && (
                <button
                  onClick={handleSkipQuestion}
                  className="bg-purple-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transition-all"
                >
                  Skip
                </button>
              )}

              {selectedAnswers.hasOwnProperty(currentIndex) && (
                <button
                  onClick={goToNextQuestion}
                  className="bg-green-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition-all"
                >
                  Next
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;