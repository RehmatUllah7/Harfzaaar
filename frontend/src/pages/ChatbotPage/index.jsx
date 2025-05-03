import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/home/Header';
import PoetHeader from '@/components/PoetHeader';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [isPoet, setIsPoet] = useState(false);

  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chatbotHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token using the correct key
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Ensure cookies are sent for authentication
        });

        const userRole = response.data.role;
        setIsPoet(userRole === "poet");
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    fetchUserRole();
  }, []);



  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatbotHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { message });
      const botMessage = { type: 'bot', text: res.data.reply };
      setChatHistory((prev) => [...prev, botMessage]);
      setMessage('');
    } catch (error) {
      const errorMessage = { type: 'bot', text: 'جواب حاصل کرنے میں مسئلہ پیش آیا۔' };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white relative">
     {isPoet ? <PoetHeader /> : <Header />}
      <div className="max-w-3xl mx-auto pt-24 px-4">
        <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl rounded-3xl p-8">
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-center">
            Chat with Harfzaar
          </h1>

          {/* Chat History */}
          <div className="max-h-80 overflow-y-auto pr-2 space-y-4 custom-scrollbar py-2">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl font-urdu leading-loose text-sm shadow-md border border-white/10 transition-all duration-300 ease-in-out
                  ${
                    msg.type === 'user'
                      ? 'bg-purple-800/50 text-right ml-10'
                      : 'bg-white/10 text-left mr-10'
                  }`}
                style={{ wordSpacing: '0.21rem' }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Box */}
          <div className="relative mt-6 group">
            <textarea
              rows={3}
              className="w-full bg-black/20 border border-white/20 rounded-2xl p-4 pr-16 text-white font-urdu placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
              placeholder="سوال لکھیں..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="absolute bottom-4 right-4 bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
