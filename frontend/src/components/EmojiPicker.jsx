import React from 'react';

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘'],
  'Gestures': ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤝', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❤️‍🔥', '💘', '💝'],
  'Nature': ['🌺', '🌸', '💐', '🌷', '🌹', '🌻', '🌼', '🌱', '🌲', '🌳', '🌴', '🍀', '🍁'],
  'Objects': ['💡', '📱', '💻', '⌚️', '📷', '🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎫', '🎟️']
};

const EmojiPicker = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = React.useState('Smileys');

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    setActiveCategory(category);
  };

  const handleEmojiClick = (e, emoji) => {
    e.stopPropagation();
    onSelect(emoji);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-lg w-72 overflow-hidden" 
      onClick={e => e.stopPropagation()}
    >
      {/* Categories */}
      <div className="flex overflow-x-auto p-2 border-b border-gray-700 custom-scrollbar">
        {Object.keys(EMOJI_CATEGORIES).map(category => (
          <button
            key={category}
            onClick={(e) => handleCategoryClick(e, category)}
            className={`px-3 py-1 whitespace-nowrap rounded-md mr-2 transition-colors ${
              activeCategory === category
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emojis */}
      <div className="p-2 h-48 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
            <button
              key={index}
              onClick={(e) => handleEmojiClick(e, emoji)}
              className="p-1 text-xl hover:bg-gray-700 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker; 