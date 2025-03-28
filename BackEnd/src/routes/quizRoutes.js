// src/routes/quizRoutes.js
import express from 'express';
import { startQuiz } from '../controllers/quizController.js';

const router = express.Router();
router.get('/start-quiz', startQuiz);
export default router;