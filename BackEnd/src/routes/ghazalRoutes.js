import express from "express";
import Ghazal from "../models/Ghazal.js";

const router = express.Router();

// ✅ Get unique poets
router.get("/poets", async (req, res) => {
  try {
    const poets = await Ghazal.distinct("poetName");
    res.json(poets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch poets" });
  }
});

// ✅ Get unique genres
router.get("/genres", async (req, res) => {
  try {
    const genres = await Ghazal.distinct("genre");
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

// ✅ Get unique poetry domains
router.get("/domains", async (req, res) => {
  try {
    const domains = await Ghazal.distinct("poetryDomain");
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch poetry domains" });
  }
});

// ✅ Filtered poetry search
router.get("/search", async (req, res) => {
  try {
    const { poet, genre, domain } = req.query;
    let filter = {};

    if (poet) filter.poetName = poet;
    if (genre) filter.genre = genre;
    if (domain) filter.poetryDomain = domain;

    const results = await Ghazal.find(filter).select("poetryTitle");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch poetry search results" });
  }
});

// ✅ Get poetry content by title
router.get("/poetry/:title", async (req, res) => {
  try {
    const poetry = await Ghazal.findOne({ poetryTitle: req.params.title });
    if (!poetry) return res.status(404).json({ error: "Poetry not found" });
    res.json(poetry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch poetry details" });
  }
});

// ✅ Get all ghazals by a specific poet
router.get("/by-poet/:poetName", async (req, res) => {
    const { poetName } = req.params;
    const ghazals = await Ghazal.find({ poetName }).select("poetryTitle poetryContent");
  
    if (!ghazals.length) return res.status(404).json({ error: "No ghazals found" });
    res.json(ghazals);
  });

  router.get('/poetry/:id', async (req, res) => {
    try {
      const poetry = await Ghazal.findById(req.params.id);
      if (!poetry) return res.status(404).json({ message: 'Poetry not found' });
      res.json(poetry);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

export default router;
