import express from "express";
import Ghazal from "../models/Ghazal.js"; // Import your poetry model

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }

  try {
    // Case-insensitive regex search in both poetryTitle & poetryContent
    const results = await Ghazal.find({
      $or: [
        { poetryTitle: { $regex: query, $options: "i" } },
        { poetryContent: { $regex: query, $options: "i" } },
      ],
    });

    // Remove duplicates based on poetryTitle
    const uniqueResults = [];
    const seenTitles = new Set();

    for (const item of results) {
      if (!seenTitles.has(item.poetryTitle)) {
        seenTitles.add(item.poetryTitle);
        uniqueResults.push(item);
      }

      if (uniqueResults.length === 10) break; // Limit to 5 unique results
    }

    res.json(uniqueResults);
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
