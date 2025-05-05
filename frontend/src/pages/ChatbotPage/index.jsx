import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/home/Header';
import PoetHeader from '@/components/PoetHeader';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [isPoet, setIsPoet] = useState(false);
  const [userId, setUserId] = useState(null); // Track user ID
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setIsPoet(response.data.role === "poet");
        setUserId(response.data.userId); // Store user ID
        
        // Load user-specific chat history
        const userChatHistory = localStorage.getItem(`chatHistory_${response.data.userId}`);
        if (userChatHistory) {
          setChatHistory(JSON.parse(userChatHistory));
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, userId]);

  const handleSend = async () => {
    if (!message.trim() || !userId) return;

    const userMessage = { type: 'user', text: message, timestamp: new Date().toISOString() };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { 
        message,
        userId // Send user ID with the message
      });
      const botMessage = { 
        type: 'bot', 
        text: res.data.reply,
        timestamp: new Date().toISOString() 
      };
      setChatHistory((prev) => [...prev, botMessage]);
      setMessage('');
    } catch (error) {
      const errorMessage = { 
        type: 'bot', 
        text: 'جواب حاصل کرنے میں مسئلہ پیش آیا۔',
        timestamp: new Date().toISOString()
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const clearHistory = () => {
    if (userId && window.confirm("Are you sure you want to clear your chat history?")) {
      setChatHistory([]);
      localStorage.removeItem(`chatHistory_${userId}`);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white relative overflow-hidden">
      {isPoet ? <PoetHeader /> : <Header />}
      
      <div className="w-full px-4 pt-12 pb-8">
    
      <p className="text-xl tracking-[0.1em] p-4 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
      اُس ایک بات تک کبھی نہ پہنچا میں
      </p>        <p className="text-xl p-2 tracking-[0.12em] text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
      کھلے تھے راستے بھی گر کلام کے
      </p> 
        <div className="mx-auto max-w-3xl w-full">
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl rounded-3xl p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                Chat with Harfzaar
              </h1>
              {userId && (
                <button 
                  onClick={clearHistory}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>
  
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
                  <div>{msg.text}</div>
                  <div className={`text-xs mt-1 opacity-70 ${msg.type === 'user' ? 'text-left' : 'text-right'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
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
                disabled={loading || !userId}
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
    </div>
  );
};

export default ChatbotPage;