import express from "express";
import Ghazal from "../models/Ghazal.js";

const router = express.Router();

// ✅ Get Ghazals by Poet Name
router.get("/by-poet/:poetName", async (req, res) => {
  try {
    const { poetName } = req.params;
    const ghazals = await Ghazal.find({ poetName }).select("poetryTitle poetryContent");

    if (!ghazals.length) {
      return res.status(404).json({ error: "No ghazals found for this poet" });
    }

    res.json(ghazals);
  } catch (error) {
    console.error("Error fetching ghazals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
