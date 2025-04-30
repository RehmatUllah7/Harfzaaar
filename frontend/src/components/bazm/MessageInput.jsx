import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const MessageInput = ({ onSendMessage, onFileUpload, selectedUser, disabled }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Select a user to start chatting" : "Type a message..."}
          disabled={disabled}
          className="flex-1 bg-white/5 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={disabled}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <FiSmile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleFileClick}
          disabled={disabled}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-2 bg-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend className="w-5 h-5" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*"
        />
      </form>

      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput; 