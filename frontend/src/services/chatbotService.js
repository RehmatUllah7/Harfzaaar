import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const getChatbotResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful assistant for a poetry website called Harfzaad. 
    The website is about Urdu poetry, literature, and culture. 
    Please provide helpful, informative, and engaging responses about:
    - Urdu poetry and literature
    - Famous poets and their works
    - Poetry forms like Ghazal, Nazm, etc.
    - Literary devices and techniques
    - Cultural context of Urdu poetry
    
    User message: ${message}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Chatbot API Error:", error);
    throw new Error("Failed to get response from chatbot");
  }
}; 