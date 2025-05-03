import express from "express";
import multer from "multer";
import path from "path";
import News from "../models/News.js";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images will be saved to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get file extension
    cb(null, Date.now() + fileExtension); // File name will be the timestamp to avoid conflicts
  },
});

const upload = multer({ storage });

// POST /api/news - Add news
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { description, content, createdBy } = req.body;

    if (!description || !content || !createdBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // If an image was uploaded, its filename will be available in req.file
    const imagePath = req.file ? req.file.filename : null; // Save the image path or filename

    const newNews = new News({
      description,
      content,
      createdBy,
      image: imagePath, // Store the image path in the database
    });

    await newNews.save();
    res.status(201).json({ message: "News created", news: newNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating news" });
  }
});

// GET /api/news - Get all news
router.get("/all", async (req, res) => {
  try {
    const allNews = await News.find().sort({ createdAt: -1 });
    res.status(200).json(allNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching news" });
  }
});

// Serve static files (images)
router.use("/uploads", express.static("uploads"));

export default router;
