import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import Header from '../../components/home/Header';
import PoetHeader from "@/components/PoetHeader";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSmile, FiSearch } from 'react-icons/fi';
import EmojiPicker from '../../components/EmojiPicker';
import axios from "axios";

const Bazm = () => {
  // State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPoet, setIsPoet] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Constants
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');
  const token = localStorage.getItem('authToken');

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setIsPoet(response.data.role === "poet");
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    fetchUserRole();
  }, [token]);

  // Socket connection management
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Connected to socket server');
        setError('');
      });

      socket.on('disconnect', () => {
        setError('Connection lost. Attempting to reconnect...');
      });

      socket.on('connect_error', () => {
        setError('Failed to connect to chat server. Please refresh the page.');
      });

      socket.on('reconnect', () => {
        setError('');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socketRef.current || !currentUserId) return;

    const socket = socketRef.current;

    const handleReceiveMessage = (message) => {
      if (message.sender !== currentUserId) {
        const newMsg = {
          ...message,
          sender: message.sender,
          senderName: message.senderName || message.sender?.username || selectedUser?.username
        };

        if (selectedUser && message.sender === selectedUser._id) {
          setMessages(prev => [...prev, newMsg]);
        }
        
        if (message.senderName || message.sender?.username) {
          setUnreadCounts(prev => ({
            ...prev,
            [message.senderName || message.sender.username]: (prev[message.senderName || message.sender.username] || 0) + 1
          }));
        }
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', ({ user, isTyping }) => {
      setTypingUsers(prev => ({ ...prev, [user]: isTyping }));
    });

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [selectedUser, currentUserId]);

  // Fetch active users
  const fetchActiveUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/bc/activeusers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setActiveUsers(await response.json());
      } else {
        setError((await response.json()).message || 'Failed to fetch active users');
      }
    } catch (error) {
      setError('Error fetching active users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchActiveUsers();
  }, [token, fetchActiveUsers]);

  // Handle user selection
  const handleUserSelect = useCallback(async (user) => {
    if (!currentUserId || !token) {
      setError('Session expired. Please log in again.');
      return;
    }

    try {
      // Reset unread count
      setUnreadCounts(prev => ({ ...prev, [user.username]: 0 }));
      setSelectedUser(user);
      setError('');
      
      const roomId = `room_${[user._id, currentUserId].sort().join('_')}`;

      // Join room
      if (socketRef.current) {
        socketRef.current.emit('join_room', roomId);
      }

      // Fetch chat history
      const historyResponse = await fetch(`http://localhost:5000/api/bc/history/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (historyResponse.status === 404) {
        // Create new chat room if it doesn't exist
        await fetch('http://localhost:5000/api/bc/room', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ participants: [user._id, currentUserId] })
        });
      }

      // Get final chat history
      const finalResponse = await fetch(`http://localhost:5000/api/bc/history/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (finalResponse.ok) {
        const data = await finalResponse.json();
        setMessages(data.messages.map(msg => ({
          ...msg,
          sender: msg.sender._id || msg.sender,
          senderName: msg.sender.username || (msg.sender === currentUserId ? currentUsername : user.username)
        })));
      } else {
        throw new Error('Failed to fetch chat history');
      }
    } catch (error) {
      setError(error.message || 'Failed to initialize chat');
    }
  }, [currentUserId, currentUsername, token]);

  // Typing indicator
  const handleTyping = useCallback(() => {
    if (!selectedUser) return;

    const roomId = `room_${[selectedUser._id, currentUserId].sort().join('_')}`;
    
    socketRef.current.emit('typing', {
      room: roomId,
      user: currentUsername,
      isTyping: true
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing', {
        room: roomId,
        user: currentUsername,
        isTyping: false
      });
    }, 1000);
  }, [selectedUser, currentUserId, currentUsername]);

  // Send message
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setShowEmoji(false);
      setError('');
      
      const roomId = `room_${[selectedUser._id, currentUserId].sort().join('_')}`;
      const messageData = {
        roomId,
        sender: currentUserId,
        senderName: currentUsername,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/bc/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) throw new Error('Failed to send message');

      const savedMessage = await response.json();
      const newMessageObj = {
        ...savedMessage,
        sender: currentUserId,
        senderName: currentUsername,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessageObj]);
      socketRef.current.emit('send_message', {
        ...newMessageObj,
        room: roomId,
        senderName: currentUsername
      });
      
      setNewMessage('');
    } catch (error) {
      setError(error.message || 'Failed to send message');
    }
  }, [newMessage, selectedUser, currentUserId, currentUsername, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort users
  const filteredUsers = activeUsers
    .filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aTime = messages.findLast(m => m.sender === a._id)?.timestamp || 0;
      const bTime = messages.findLast(m => m.sender === b._id)?.timestamp || 0;
      return new Date(bTime) - new Date(aTime);
    });

  // Format message time
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 'Just now' : formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {isPoet ? <PoetHeader /> : <Header />}
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-white/10 rounded-lg text-white"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Active Users Sidebar - Hidden on mobile when not active */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-1/3 lg:w-1/4 bg-white/10 backdrop-blur-lg z-10 absolute md:relative h-full`}>
          <div className="p-4 border-b border-gray-700/30 bg-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Active Users</h2>
              <button
                onClick={() => setIsSearching(!isSearching)}
                className="p-2 text-gray-400 hover:text-purple-500"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isSearching && (
            <div className="p-4 border-b border-gray-700/30">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full p-3 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {loading ? (
              <div className="p-4 text-center text-gray-300">Loading users...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-400">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-300">
                {searchQuery ? 'No users found' : 'No active users found'}
              </div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user._id}
                  onClick={() => {
                    handleUserSelect(user);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-4 cursor-pointer ${selectedUser?._id === user._id ? 'bg-white/15' : ''}`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      {unreadCounts[user.username] > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                          {unreadCounts[user.username] > 10 ? '10+' : unreadCounts[user.username]}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-white">{user.username}</div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-lg">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-700/30 bg-white/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white">
                    {selectedUser.username[0].toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-white">{selectedUser.username}</div>
                    <div className="text-sm text-green-400">
                      {typingUsers[selectedUser.username] ? 'typing...' : 'Online'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <FiSmile className="w-8 h-8" />
                    </div>
                    <p>Start the conversation with {selectedUser.username}!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender === currentUserId;
                      return (
                        <div
                          key={index}
                          className={`mb-4 ${isCurrentUser ? 'text-right' : 'text-left'}`}
                        >
                          <div
                            className={`inline-block p-3 rounded-xl max-w-[80%] md:max-w-[70%] ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p>{message.content}</p>
                            <div className="text-xs opacity-75 mt-1">
                              {formatMessageTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="p-4 border-t border-gray-700/30 bg-white/5">
                <form onSubmit={handleSendMessage} className="relative">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmoji(!showEmoji)}
                      className="p-2 text-gray-400 hover:text-purple-500"
                    >
                      <FiSmile className="w-5 h-5" />
                    </button>
                    
                    {showEmoji && (
                      <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2">
                        <EmojiPicker onSelect={(emoji) => {
                          setNewMessage(prev => prev + emoji);
                          setShowEmoji(false);
                        }} />
                      </div>
                    )}

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type a message..."
                      className="flex-1 p-3 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg disabled:opacity-50"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <FiSmile className="w-10 h-10" />
              </div>
              <p className="text-xl font-semibold mb-2">Welcome to HarfZaar Chat</p>
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bazm;