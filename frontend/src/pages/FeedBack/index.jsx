import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Update the handleSubmit function in your FeedbackPage component
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  
  if (Object.keys(validationErrors).length === 0) {
    setIsSubmitting(true);
    
  
    try {
      const response = await fetch('http://localhost:5000/api/feedback', {  // Updated this line
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({
        ...errors,
        submit: 'Failed to submit feedback. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  } else {
    setErrors(validationErrors);
  }
};
const resetForm = () => {
  setFormData({
    name: "",
    email: "",
    message: "",
  });
  setErrors({});
  setSubmitted(false);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500 opacity-10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center text-white hover:text-purple-300 transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back</span>
      </button>
      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">

{/* Paragraph Above Box */}

              <p className="text-xl tracking-[0.02em] p-2 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
              ٹھیک ہے خود کو ہم بدلتے ہیں                         </p>
              <p className="text-xl tracking-[0.09em] p-2 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
              شکریہ مشورت کا چلتے ہیں                                    </p> 
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20 transition-all duration-500 hover:shadow-purple-500/30">
          <div className="p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500 bg-opacity-20 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-purple-200 mb-6">Your feedback has been received. We appreciate it! 💜</p>
               <button
  onClick={() => {
    resetForm();
    setSubmitted(false);
  }}
  className="px-6 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full border border-white border-opacity-20 transition-all duration-300"
>
  Submit Another
</button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-3">Share Your Thoughts</h2>
                  <p className="text-purple-200 max-w-md mx-auto">
                    We'd love to hear your feedback to help us improve your experience.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.name
                          ? "border-red-400 focus:ring-red-300"
                          : "border-white border-opacity-20 focus:border-purple-300 focus:ring-purple-300"
                      } text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-300 text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.email
                          ? "border-red-400 focus:ring-red-300"
                          : "border-white border-opacity-20 focus:border-purple-300 focus:ring-purple-300"
                      } text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-300 text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">Your Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.message
                          ? "border-red-400 focus:ring-red-300"
                          : "border-white border-opacity-20 focus:border-purple-300 focus:ring-purple-300"
                      } text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all resize-none`}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What's on your mind?"
                    />
                    {errors.message && (
                      <p className="text-red-300 text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                        isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:shadow-purple-500/50"
                      } flex items-center justify-center`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Feedback"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
</div>
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;