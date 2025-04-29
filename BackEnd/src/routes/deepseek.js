import { Router } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Ghazal from "../models/Ghazal.js"; 
const router = Router();
const upload = multer();

// Function to normalize poet names (for spelling variations like Ahmed vs. Ahmad)
function normalizePoetName(name) {
  // Create a mapping of common name variations
  const nameCorrections = {
    "ahmed": "ahmad",
    "jon":"jaun",
    "elia":"eliya",
    "muhammad":"allama",
    
    // Add other common variations as needed
  };

  // Convert the name to lowercase and replace spaces with hyphens
  const normalized = name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .split("-")
    .map((part) => nameCorrections[part] || part) // Replace variations with the correct form
    .join("-"); // Join back the name

  return normalized;
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype;

    // Create the AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY1);

    // Use the correct model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: "Based on the image, suggest one genre from: Nature, Philosophical, Humorous ,Inspirational, Melancholic , Mystical, Romantic and Social. Only respond with one word like (Nature). If it is an image of a person (a poet), do not return any genre, return only poet's name in the format: 'Ahmed Faraz'.",
      },
    ]);

    const text = result.response.text();
    const genreOrPoet = text.trim();

    console.log("Received file:", req.file);
    console.log("Model response:", genreOrPoet);

    // Check if the response is a genre or a poet's name
    let responseData = {};

    // If the response is a genre, search for related poetry
    if (["Nature", "Philosophical", "Humorous", "Inspirational", "Melancholic", "Mystical", "Romantic", "Social"].includes(genreOrPoet)) {
      // It is a genre, so search for poetry by genre
      const poetry = await Ghazal.find({ genre: genreOrPoet });

      if (poetry.length === 0) {
        return res.status(404).json({ error: "No poetry found for the detected genre" });
      }

      responseData = {
        genre: genreOrPoet,
        poetry: poetry.map((ghazal) => ({
          title: ghazal.poetryTitle,
          content: ghazal.poetryContent,
        })),
      };
    } else {
      // It is a poet's name, normalize the name
      const formattedPoetName = normalizePoetName(genreOrPoet);
      console.log("Normalized Poet Name:", formattedPoetName);
      // Search for poetry by the normalized poet name
      const poetry = await Ghazal.find({ poetName: formattedPoetName });

      if (poetry.length === 0) {
        return res.status(404).json({ error: `No poetry found for poet ${formattedPoetName}` });
      }

      responseData = {
        poet: formattedPoetName,
        poetry: poetry.map((ghazal) => ({
          title: ghazal.poetryTitle,
          content: ghazal.poetryContent,
        })),
      };
    }

    // Send the response with either the genre or poet's name and related poetry
    res.json(responseData);

    console.log("Total matched items:", responseData.poetry.length);

  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;
