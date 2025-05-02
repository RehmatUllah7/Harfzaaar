import express from "express";
import { submitPoetDetails } from "../controllers/poetController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllPoets } from "../controllers/poetController.js";
import Poet from "../models/Poet.js";
const router = express.Router();


router.post("/submit", protect, submitPoetDetails);




router.get("/getall", getAllPoets);



// Get poet details by name
router.get("/:poetName", async (req, res) => {
  try {
    const { poetName } = req.params;
    const poet = await Poet.findOne({ name: poetName }).populate('ghazals');
    
    if (!poet) {
      return res.status(404).json({ message: "Poet not found" });
    }

    res.json(poet);
  } catch (error) {
    console.error("Error fetching poet details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
