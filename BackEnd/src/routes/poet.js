import express from "express";
import { submitPoetDetails } from "../controllers/poetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitPoetDetails);

export default router;
