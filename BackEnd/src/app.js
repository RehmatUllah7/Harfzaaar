import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import { config } from "dotenv";
import { createServer } from 'http';
import { Server } from 'socket.io';

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import qaafiaRoutes from "./routes/qaafia.js";
import quizRoutes from "./routes/quizRoutes.js";
import ghazalRoutes from "./routes/ghazalRoutes.js";
import poetryRoutes from "./routes/poetryRoutes.js";
import searchRoutes from "./routes/search.js";
import deepseekRoutes from "./routes/deepseek.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatbotRoute from "./routes/chatbot.js";
import './cron.js';  
import poetRoutes from './routes/poet.js';

// Load environment variables
config();

// Database connection
connectDB();

// Create express app
const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle new messages
  socket.on('send_message', async (data) => {
    try {
      console.log('Received message:', data);
      // Broadcast to all clients in the room except the sender
      socket.to(data.room).emit('receive_message', {
        sender: data.sender,
        senderName: data.senderName,
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
        unread: true
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle typing status
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', {
      user: data.user,
      isTyping: data.isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- CORS Configuration ---
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Body Parser ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/bc", chatRoutes);
app.use("/api/qaafia", qaafiaRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/ghazals", ghazalRoutes);
app.use("/api/poetry", poetryRoutes);
app.use("/api", searchRoutes);
app.use("/api/deepseek", deepseekRoutes);
app.use('/api/chatbot', chatbotRoute); 
app.use('/api/poets', poetRoutes);

// --- 404 Not Found Handler ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Server Listen ---
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
