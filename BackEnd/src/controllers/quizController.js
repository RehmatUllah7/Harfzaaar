// src/controllers/quizcontroller.js

import { getQuizQuestions } from '../services/geminiService.js';

export const startQuiz = async (req, res) => {
  try {
    const questions = await getQuizQuestions();
    res.json({ questions });
  } catch (error) {
    console.error("Quiz API Error:", error);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
};
