import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files and documents
    if (file.mimetype.startsWith('audio/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get chat history
router.get('/:roomId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ roomId: req.params.roomId })
      .populate('participants', 'name email')
      .populate('messages.sender', 'name email');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload voice message or document
router.post('/upload/:roomId', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const chat = await Chat.findOne({ roomId: req.params.roomId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const newMessage = {
      sender: req.user._id,
      content: req.body.content || 'Sent a file',
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      duration: req.body.duration // For voice messages
    };

    chat.messages.push(newMessage);
    chat.lastActivity = Date.now();
    await chat.save();

    // Populate sender information
    const populatedMessage = await Chat.populate(
      newMessage,
      { path: 'sender', select: 'name email' }
    );

    res.json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update chat
router.post('/', auth, async (req, res) => {
  try {
    let chat = await Chat.findOne({ roomId: req.body.roomId });
    
    if (!chat) {
      chat = new Chat({
        roomId: req.body.roomId,
        participants: req.body.participants
      });
    }

    if (req.body.message) {
      chat.messages.push({
        sender: req.user._id,
        content: req.body.message
      });
    }
    
    chat.lastActivity = Date.now();
    await chat.save();
    
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email')
      .populate('messages.sender', 'name email');
    
    res.json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 