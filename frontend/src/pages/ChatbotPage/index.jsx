import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/home/Header';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { message });
      setResponse(res.data.reply);
      setMessage('');
    } catch (err) {
      setResponse('Error fetching response');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full -top-32 -left-32 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full -bottom-48 -right-48 animate-pulse delay-300"></div>
      </div>
      
      <Header />
      
      <div className="max-w-2xl mx-auto pt-20 px-4 relative z-10">
        {/* Chat container */}
        <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Chat with Harfzaar
            </h1>

            {/* Response area */}
            {response && (
              <div className="mb-8 p-6 bg-black/30 rounded-xl border border-white/10 animate-fade-in">
                <div className="text-lg font-urdu leading-loose text-gray-100 whitespace-pre-wrap"style={{ wordSpacing: '0.21rem' }}>
                  {response}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="relative group">
              <textarea
                rows={3}
                className="w-full bg-black/30 border border-white/20 rounded-2xl p-4 pr-16 text-gray-100 font-urdu placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                placeholder="Ask something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              />
              
              <button
                onClick={handleSend}
                disabled={loading}
                className="absolute bottom-4 right-4 bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 "
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