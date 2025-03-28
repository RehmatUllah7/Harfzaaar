import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import qaafiaRoutes from "./routes/qaafia.js";
import quizRoutes from "./routes/quizRoutes.js";
import ghazalRoutes from "./routes/ghazalRoutes.js";
import poetryRoutes from "./routes/poetryRoutes.js";
import searchRoutes from './routes/search.js';
config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/api/qaafia", qaafiaRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/ghazals", ghazalRoutes);
app.use("/api/poetry", poetryRoutes);
app.use("/api", searchRoutes);

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});