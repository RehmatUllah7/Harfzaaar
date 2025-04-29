import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getChatHistory,
  createChatRoom,
  saveMessage,
  getActiveUsers,
  uploadFile
} from '../controllers/chatController.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat_files',
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

// Get chat history
router.get('/history/:roomId', protect, getChatHistory);

// Create a new chat room
router.post('/room', protect, createChatRoom);

// Save a message
router.post('/message', protect, saveMessage);

// Get active users
router.get('/activeusers', protect, getActiveUsers);

// Upload file
router.post('/upload', protect, upload.single('file'), uploadFile);

export default router; 