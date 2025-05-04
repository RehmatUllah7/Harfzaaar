import express from "express";
import Ghazal from "../models/Ghazal.js";
import { protect } from "../middlewares/authMiddleware.js"; // Import your protect middleware
import { getMyPoetry } from "../controllers/poetController.js";
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

// 🔒 Protected Route: Get Authenticated Poet's Works (new feature)
router.get("/my-poetry", protect, async (req, res) => {
  try {
    // Get poetry using both poetName and userRef for reliability
    const poetry = await Ghazal.find({
      $or: [
        { poetName: req.user.username }, // For backward compatibility
        { userRef: req.user._id }        // For enhanced security
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

    res.status(200).json({
      success: true,
      poetName: req.user.username,
      poetry,
      count: poetry.length
    });
  } catch (error) {
    console.error("Error in /my-poetry:", error);
    errorResponse(res, 500, "Error fetching your poetry");
  }
});

// 🔒 Protected Route: Delete Poetry
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedPoem = await Ghazal.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { poetName: req.user.username }, // Old format
        { userRef: req.user._id }        // New format
      ]
    });

    if (!deletedPoem) {
      return errorResponse(res, 404, "Poetry not found or unauthorized");
    }

    res.status(200).json({
      success: true,
      message: "Poetry deleted successfully",
      deletedId: req.params.id
    });
  } catch (error) {
    console.error("Error deleting poetry:", error);
    errorResponse(res, 500, "Error deleting poetry");
  }
});

export default router;
