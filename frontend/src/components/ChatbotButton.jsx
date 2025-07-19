import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatbotButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === '/chatbot') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-28 right-10  bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      aria-label="Open chat"
    >
      {/* Animated background pulse */}
      <span className="absolute -inset-2 animate-ping hidden sm:block bg-blue-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      
      {/* Glowing ring effect */}
      <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-400/40 to-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Notification dot */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-white animate-bounce"></span>

      {/* Chat icon with hover animation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    </button>
  );
};

export default ChatbotButton;