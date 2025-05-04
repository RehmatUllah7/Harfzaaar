import express from "express";
import multer from "multer";
import path from "path";
import News from "../models/News.js";
import { protect } from "../middlewares/authMiddleware.js"; // Import your protect middleware

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);
  },
});

const upload = multer({ storage });

router.post("/", protect, upload.single("image"), async (req, res) => {
    try {
      const { description, content } = req.body;
      
      const newNews = new News({
        description,
        content,
        createdBy: {
          userId: req.user._id,  // From auth middleware
          username: req.user.username  // From auth middleware
        },
        image: req.file ? req.file.filename : null
      });
  
      await newNews.save();
      res.status(201).json(newNews);
    } catch (error) {
      res.status(500).json({ message: "Error creating news" });
    }
  });
  router.get("/all", async (req, res) => {
    try {
      const news = await News.find().sort({ createdAt: -1 });
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });
// GET /api/news/my-news - Get current user's news (protected)
router.get("/my-news", protect, async (req, res) => {
    try {
      const newsItems = await News.find({ 
        "createdBy.userId": req.user._id  // Query using the nested userId
      }).sort({ createdAt: -1 });
      
      res.status(200).json(newsItems);
    } catch (error) {
      console.error("Error fetching user news:", error);
      res.status(500).json({ 
        message: "Error fetching your news",
        error: error.message 
      });
    }
  });
// DELETE /api/news/:id - Delete news (protected)
router.delete("/:id", protect, async (req, res) => {
    try {
      const newsItem = await News.findOneAndDelete({ 
        _id: req.params.id,
        "createdBy.userId": req.user._id // Check nested userId
      });
  
      if (!newsItem) {
        return res.status(404).json({ 
          message: "News not found or you don't have permission",
          details: {
            requestedId: req.params.id,
            userId: req.user._id
          }
        });
      }
  
      res.status(200).json({ 
        message: "News deleted successfully",
        deletedNews: newsItem 
      });
    } catch (error) {
      console.error("Error deleting news:", {
        error: error.message,
        params: req.params,
        user: req.user
      });
      res.status(500).json({ 
        message: "Error deleting news",
        error: error.message 
      });
    }
  });
// Serve static files (images)
router.use("/uploads", express.static("uploads"));

export default router;