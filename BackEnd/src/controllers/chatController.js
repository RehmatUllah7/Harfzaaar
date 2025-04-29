import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log('Fetching chat history for room:', roomId);
    
    const chat = await Chat.findOne({ roomId })
      .populate('messages.sender', 'username')
      .populate('participants', 'username');

    if (!chat) {
      console.log('Chat room not found:', roomId);
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Reset unread count for the current user
    const currentUserId = req.user._id.toString();
    chat.unreadCounts.set(currentUserId, 0);
    await chat.save();

    console.log('Chat history found:', chat);
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

// Create a new chat room
export const createChatRoom = async (req, res) => {
  try {
    const { participants } = req.body;
    console.log('Creating chat room with participants:', participants);
    
    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length !== 2) {
      return res.status(400).json({ message: 'Invalid participants data' });
    }

    // Check if participants exist
    const users = await User.find({ _id: { $in: participants } });
    if (users.length !== 2) {
      return res.status(400).json({ message: 'One or more participants not found' });
    }

    // Create a consistent roomId
    const roomId = `room_${participants.sort().join('_')}`;
    console.log('Generated roomId:', roomId);

    // Check if room already exists
    const existingRoom = await Chat.findOne({ roomId });
    if (existingRoom) {
      console.log('Room already exists:', existingRoom);
      return res.status(200).json(existingRoom);
    }

    // Create new chat room
    const chat = new Chat({
      roomId,
      participants,
      messages: [],
      unreadCounts: new Map()
    });

    await chat.save();
    console.log('Chat room created successfully:', chat);
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Error creating chat room' });
  }
};

// Save a message
export const saveMessage = async (req, res) => {
  try {
    const { roomId, sender, content, fileUrl, fileName, fileType } = req.body;
    console.log('Saving message in room:', roomId);

    const chat = await Chat.findOne({ roomId });
    if (!chat) {
      console.log('Chat room not found for message:', roomId);
      return res.status(404).json({ message: 'Chat room not found' });
    }

    const messageData = {
      sender,
      content,
      timestamp: new Date(),
      read: false
    };

    // Add file information if present
    if (fileUrl) {
      messageData.fileUrl = fileUrl;
      messageData.fileName = fileName;
      messageData.fileType = fileType;
    }

    chat.messages.push(messageData);
    chat.lastActivity = new Date();

    // Update unread counts for all participants except sender
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== sender) {
        const currentCount = chat.unreadCounts.get(participantId.toString()) || 0;
        chat.unreadCounts.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();
    
    console.log('Message saved successfully');
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message' });
  }
};

// Get active users with unread counts
export const getActiveUsers = async (req, res) => {
  try {
    console.log('Fetching active users');
    
    // Update current user's activity
    const currentUser = await User.findById(req.user._id);
    if (currentUser) {
      currentUser.lastActivity = Date.now();
      currentUser.isActive = true;
      await currentUser.save();
    }

    // Get all active users
    const activeUsers = await User.find({
      isActive: true,
      _id: { $ne: req.user._id } // Exclude current user
    }).select('username email isActive lastActivity');

    // Get unread counts for each user
    const unreadCounts = {};
    const chats = await Chat.find({
      participants: req.user._id
    });

    chats.forEach(chat => {
      chat.participants.forEach(participantId => {
        if (participantId.toString() !== req.user._id.toString()) {
          const count = chat.unreadCounts.get(req.user._id.toString()) || 0;
          unreadCounts[participantId.toString()] = count;
        }
      });
    });

    // Add unread counts to active users
    const activeUsersWithCounts = activeUsers.map(user => ({
      ...user.toObject(),
      unreadCount: unreadCounts[user._id.toString()] || 0
    }));

    console.log('Active users found:', activeUsersWithCounts.length);
    res.status(200).json(activeUsersWithCounts);
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ message: 'Error fetching active users' });
  }
};

// Upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File has been uploaded to Cloudinary by multer-storage-cloudinary
    const fileUrl = req.file.path;
    
    res.status(200).json({
      fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
}; 