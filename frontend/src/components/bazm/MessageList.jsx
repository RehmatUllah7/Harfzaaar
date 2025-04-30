import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { FiClock } from 'react-icons/fi';

const MessageList = ({ messages, currentUser, selectedUser, loading, error }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Select a user to start chatting</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">No messages yet. Start the conversation!</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.sender === currentUser.username;
        const showAvatar = index === 0 || messages[index - 1]?.sender !== message.sender;
        const showTime = index === messages.length - 1 || messages[index + 1]?.sender !== message.sender;

        return (
          <div
            key={message._id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {!isCurrentUser && showAvatar && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold mr-2">
                {message.sender[0].toUpperCase()}
              </div>
            )}
            <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
              {!isCurrentUser && showAvatar && (
                <span className="text-xs text-gray-400 mb-1">{message.sender}</span>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {message.content}
              </div>
              {showTime && (
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <FiClock className="w-3 h-3 mr-1" />
                  {format(new Date(message.timestamp), 'HH:mm')}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 