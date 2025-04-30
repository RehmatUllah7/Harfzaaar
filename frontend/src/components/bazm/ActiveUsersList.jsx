import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ActiveUsersList = ({
  activeUsers,
  selectedUser,
  onUserSelect,
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
  unreadCounts,
  loading,
  error
}) => {
  const filteredUsers = activeUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/4 min-w-[280px] flex flex-col bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
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
      {isSearching && (
        <div className="border-b border-gray-700/30 bg-white/5">
          <div className="p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full p-3 bg-white/5 text-white placeholder-gray-400 rounded-lg border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

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
          filteredUsers.map(user => {
            const unreadCount = unreadCounts[user.username] || 0;
            return (
              <div
                key={user._id}
                onClick={() => onUserSelect(user)}
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
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                          {unreadCount > 10 ? '10+' : unreadCount}
                        </div>
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActiveUsersList; 