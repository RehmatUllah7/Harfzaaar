import express from "express";
import Ghazal from "../models/Ghazal.js"; // Import your poetry model
import Fuse from "fuse.js"; // Import Fuse.js

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }

  try {
    // Fetch all ghazals
    const ghazals = await Ghazal.find({});

    // Set up Fuse.js options
    const fuse = new Fuse(ghazals, {
      keys: ["poetryTitle", "poetryContent"], // Search these fields
      threshold: 0.4, // Lower means more strict match, you can tweak
    });

    // Perform fuzzy search
    const fuzzyResults = fuse.search(query);

    // Extract original items (fuse returns object with score/item)
    const uniqueResults = [];
    const seenTitles = new Set();

    for (const result of fuzzyResults) {
      const item = result.item;
      if (!seenTitles.has(item.poetryTitle)) {
        seenTitles.add(item.poetryTitle);
        uniqueResults.push(item);
      }

      if (uniqueResults.length === 10) break; // Limit to 10 unique results
    }

    res.json(uniqueResults);
  } catch (error) {
    console.error("Error in fuzzy search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
