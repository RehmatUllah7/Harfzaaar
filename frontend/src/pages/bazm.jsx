import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/home/Header";
import { FaPaperPlane } from "react-icons/fa";

const Bazm = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "السلام علیکم! کیسے ہیں آپ؟", sender: "user1" },
    { id: 2, text: "وعلیکم السلام! میں ٹھیک ہوں، آپ سنائیں؟", sender: "user2" }
  ]);
  
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState("user1"); // Toggle between user1 & user2
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (messageText.trim() === "") return;
    
    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: currentUser
    };

    setMessages([...messages, newMessage]);
    setMessageText(""); // Clear input
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      <Header />
      
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-3xl  font-urdu font-bold text-center text-gray-800 mb-4">🌙 محفلِ بزم</h2>
        <p className="text-center font-urdu text-gray-600 mb-4">یہاں اپنے خیالات اور شاعری کا تبادلہ کریں</p>

        {/* Messages Container */}
        <div className="border rounded-lg  font-urdu p-4 bg-gray-100 h-80 overflow-y-auto shadow-inner">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-xs shadow-md ${msg.sender === currentUser ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-900"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="mt-4 flex">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="پیغام لکھیں..."
            className="flex-1 p-3 border rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 urdu-font"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            <FaPaperPlane />
          </button>
        </div>

        {/* Toggle Users Button */}
        <button
          onClick={() => setCurrentUser(currentUser === "user1" ? "user2" : "user1")}
          className="mt-3 bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-full text-sm"
        >
          {currentUser === "user1" ? "Switch to User 2" : "Switch to User 1"}
        </button>
      </div>

      {/* Urdu Font Styling */}
      <style>
        {`
          .urdu-font {
            font-family: "Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif;
            font-size: 18px;
            direction: rtl;
            text-align: right;
          }
        `}
      </style>
    </div>
  );
};

export default Bazm;
