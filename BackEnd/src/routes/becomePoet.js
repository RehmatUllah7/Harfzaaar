import express from 'express';
import { becomePoet } from '../controllers/becomePoetController.js';
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', protect, becomePoet);

export default router;
