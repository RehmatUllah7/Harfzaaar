import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import Header from '../../components/home/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSmile, FiSearch } from 'react-icons/fi';
import EmojiPicker from '../../components/EmojiPicker';

const Bazm = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        console.log('Current user ID:', localStorage.getItem('userId'));
        setError('');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setError('Connection lost. Attempting to reconnect...');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setError('Failed to connect to chat server. Please refresh the page.');
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log('Reconnected to socket server after', attemptNumber, 'attempts');
        setError('');
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array as this should only run once

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.removeAllListeners('receive_message');
    
    socketRef.current.on('receive_message', (message) => {
      console.log('Received message:', message); // Debug log
      const currentUserId = localStorage.getItem('userId');
      
      if (message.sender !== currentUserId) {
        const newMessage = {
          ...message,
          sender: message.sender,
          senderName: message.senderName || message.sender?.username || selectedUser?.username
        };

        // Only add message to current chat if it's from the selected user
        if (selectedUser && message.sender === selectedUser._id) {
          setMessages(prev => [...prev, newMessage]);
        }
        
        // Update unread count for the sender
        const senderUsername = message.senderName || message.sender?.username;
        if (senderUsername) {
          console.log('Updating unread count for:', senderUsername); // Debug log
          setUnreadCounts(prev => {
            const currentCount = prev[senderUsername] || 0;
            const newCounts = {
              ...prev,
              [senderUsername]: currentCount + 1
            };
            console.log('New unread counts:', newCounts); // Debug log
            return newCounts;
          });
        }
      }
    });

    socketRef.current.on('user_typing', ({ user, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [user]: isTyping
      }));
    });

    // Fetch active users
    fetchActiveUsers();

    return () => {
      socketRef.current?.removeAllListeners('receive_message');
    };
  }, [selectedUser]); // Only depend on selectedUser

  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/bc/activeusers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Active users:', data);
        setActiveUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch active users');
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
      setError('Error fetching active users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      console.log('Selecting user:', user.username); // Debug log
      // Reset unread count for selected user
      setUnreadCounts(prev => {
        const newCounts = { ...prev };
        if (user.username) {
          newCounts[user.username] = 0;
        }
        console.log('Resetting unread count for:', user.username); // Debug log
        console.log('New unread counts:', newCounts); // Debug log
        return newCounts;
      });
      
      setSelectedUser(user);
      setLoadingMessages(true);
      setError('');
      
      const currentUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      
      if (!currentUserId || !token) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return;
      }

      const roomId = `room_${[user._id, currentUserId].sort().join('_')}`;

      // Join room
      if (socketRef.current) {
        socketRef.current.emit('join_room', roomId);
      }

      // Fetch chat history
      const historyResponse = await fetch(`http://localhost:5000/api/bc/history/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (historyResponse.status === 404) {
        // Create new chat room if it doesn't exist
        const createResponse = await fetch('http://localhost:5000/api/bc/room', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            participants: [user._id, currentUserId]
          })
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create chat room');
        }
      }

      // Fetch final chat history
      const finalHistoryResponse = await fetch(`http://localhost:5000/api/bc/history/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (finalHistoryResponse.ok) {
        const data = await finalHistoryResponse.json();
        const transformedMessages = data.messages.map(msg => ({
          ...msg,
          sender: msg.sender._id || msg.sender,
          senderName: msg.sender.username || (msg.sender === currentUserId ? localStorage.getItem('username') : user.username)
        }));
        setMessages(transformedMessages);
      } else {
        throw new Error('Failed to fetch chat history');
      }
    } catch (error) {
      setError(error.message || 'Failed to initialize chat');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleTyping = () => {
    if (!selectedUser) return;

    socketRef.current.emit('typing', {
      room: `room_${[selectedUser._id, localStorage.getItem('userId')].sort().join('_')}`,
      user: localStorage.getItem('username'),
      isTyping: true
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing', {
        room: `room_${[selectedUser._id, localStorage.getItem('userId')].sort().join('_')}`,
        user: localStorage.getItem('username'),
        isTyping: false
      });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const formatMessageTime = (timestamp) => {
    try {
      // Handle different timestamp formats
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sendingMessage) return;

    try {
      setShowEmoji(false);
      setSendingMessage(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      const currentUserId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      
      if (!token || !currentUserId) {
        setError('Authentication error. Please log in again.');
        return;
      }

      const roomId = `room_${[selectedUser._id, currentUserId].sort().join('_')}`;
      const messageData = {
        roomId,
        sender: currentUserId,
        senderName: username,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      const saveResponse = await fetch('http://localhost:5000/api/bc/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to send message');
      }

      const savedMessage = await saveResponse.json();

      // Create new message object with proper sender information
      const newMessageObj = {
        _id: savedMessage._id || Date.now().toString(),
        sender: currentUserId,
        senderName: username,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Add message to current chat immediately
      setMessages(prev => [...prev, newMessageObj]);

      // Emit socket message with sender information
      socketRef.current.emit('send_message', {
        ...newMessageObj,
        room: roomId,
        senderName: username
      });
      
      setNewMessage('');
      setError('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const renderMessages = () => {
    return messages.map((message, index) => {
      const isCurrentUser = message.sender === localStorage.getItem('userId');
      
      return (
        <motion.div
          key={index}
          layout
          layoutId={message._id || index}
          variants={messageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`mb-4 ${isCurrentUser ? 'text-right' : 'text-left'}`}
        >
          <div
            className={`inline-block p-4 rounded-2xl max-w-[70%] break-words ${
              isCurrentUser
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-white'
            }`}
          >
            <p className="mb-2">{message.content}</p>
            <span className="text-xs opacity-75 block mt-1">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>
        </motion.div>
      );
    });
  };

  useEffect(() => {
    if (activeUsers.length > 0) {
      // Create a map of user IDs to their latest message timestamp
      const userLatestMessage = {};
      messages.forEach(message => {
        const senderId = message.sender;
        const timestamp = new Date(message.timestamp).getTime();
        if (!userLatestMessage[senderId] || timestamp > userLatestMessage[senderId]) {
          userLatestMessage[senderId] = timestamp;
        }
      });

      // Sort active users based on their latest message timestamp
      const sorted = [...activeUsers].sort((a, b) => {
        const aTime = userLatestMessage[a._id] || 0;
        const bTime = userLatestMessage[b._id] || 0;
        return bTime - aTime; // Descending order (most recent first)
      });

      setSortedUsers(sorted);
    }
  }, [activeUsers, messages]);

  // Add search filter function
  const filteredUsers = sortedUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Active Users Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-1/4 min-w-[280px] flex flex-col bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700/30 bg-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Active Users</h2>
              <button
                onClick={() => setIsSearching(!isSearching)}
                className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Field */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-gray-700/30 bg-white/5"
              >
                <div className="p-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full p-3 bg-white/5 text-white placeholder-gray-400 rounded-lg border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Users List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-4 text-center text-gray-300">Loading users...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-400">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-300">
                {searchQuery ? 'No users found' : 'No active users found'}
              </div>
            ) : (
              <AnimatePresence>
                {filteredUsers.map(user => {
                  const unreadCount = unreadCounts[user.username] || 0;
                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleUserSelect(user)}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                        selectedUser?._id === user._id ? 'bg-white/15' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                              {user.username[0].toUpperCase()}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            {unreadCount > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900"
                              >
                                {unreadCount > 10 ? '10+' : unreadCount}
                              </motion.div>
                            )}
                          </div>
                          <div className="ml-3">
                            <span className="font-medium text-white">{user.username}</span>
                            <span className="text-xs text-gray-400 block">
                              {formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-700/30 bg-white/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {selectedUser.username[0].toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h2 className="text-xl font-semibold text-white">{selectedUser.username}</h2>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-full text-gray-400">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center"
                    >
                      <FiSmile className="w-8 h-8" />
                    </motion.div>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      Start the conversation with {selectedUser.username}!
                    </motion.p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender === localStorage.getItem('userId');
                      const messageKey = message._id || `${message.sender}_${message.timestamp}_${index}`;
                      
                      return (
                        <motion.div
                          key={messageKey}
                          layout
                          layoutId={messageKey}
                          variants={messageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className={`mb-4 ${isCurrentUser ? 'text-right' : 'text-left'}`}
                        >
                          <div
                            className={`inline-block p-4 rounded-2xl max-w-[70%] break-words ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p className="mb-2">{message.content}</p>
                            <span className="text-xs opacity-75 block mt-1">
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-t border-gray-700/30 bg-white/5"
              >
                <div className="relative">
                  {/* Emoji Picker */}
                  <div className="absolute bottom-full left-4 mb-2" style={{ zIndex: 1000 }}>
                    {showEmoji && (
                      <div ref={emojiPickerRef}>
                        <EmojiPicker onSelect={handleEmojiSelect} />
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="relative">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowEmoji(!showEmoji);
                        }}
                      >
                        <FiSmile className="w-6 h-6" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          } else {
                            handleTyping();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 p-4 bg-white/5 text-white placeholder-gray-400 rounded-xl border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessage.trim()}
                        className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center"
              >
                <FiSmile className="w-10 h-10" />
              </motion.div>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xl font-semibold mb-2"
              >
                Welcome to HarfZaar Chat
              </motion.p>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Select a user to start chatting
              </motion.p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add custom scrollbar styles to your CSS
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Bazm;