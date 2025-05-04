// routes/ghazals.js
import express from "express";
import Ghazal from "../models/Ghazal.js";

const router = express.Router();

// POST /api/addpoetry - Add new poetry
router.post("/", async (req, res) => {
  try {
    const { poetName, poetryDomain, poetryTitle, poetryContent, genre } = req.body;

    if (!poetName || !poetryDomain || !poetryTitle || !poetryContent || !genre) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ghazal = new Ghazal({
        poetName,
        poetryDomain,
        poetryTitle,
        poetryContent,
        genre,
      });
  
      const savedGhazal = await ghazal.save();
      console.log('Ghazal saved successfully:', savedGhazal._id);
      res.status(201).json({ message: "Ghazal created", ghazal: savedGhazal });
    } catch (error) {
      console.error("Error creating ghazal:", error);
      res.status(500).json({ message: "Error creating ghazal" });
    }
  });
export default router;
