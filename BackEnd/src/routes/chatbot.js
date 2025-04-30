import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Harfzaar AI prompt: an Urdu poetry and literary expert with an elegant tone
const systemPrompt = `
You are Harfzaar AI, an expert assistant in Urdu poetry, ghazals, literary figures, and cultural history.
Always reply in an elegant yet simple tone. When possible, use poetic references to enhance responses.only respond in urdu.
Avoid casual internet slang.
`;

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser: ${message}\n\nReply:` }
          ],
        },
      ],
    });

    let reply = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Remove Markdown-style bold (**text**) if present
    reply = reply.replace(/\*\*(.*?)\*\*/g, '$1');
    console.log("ChatBot Rerply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("Gemini Chatbot Error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

export default router;
