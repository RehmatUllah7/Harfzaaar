import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getQuizQuestions = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 10 quiz questions related to Urdu literature, novels, poetry, poems, ghazals, history, and famous authors. The questions should cover a variety of topics, ensuring different questions each time.  
    Remember, i will ask same question multiple times so make sure to generate different questions each time.
    Return the response in strict JSON format as shown below:
    {
      "questions": [
        { "question": "What is the question?", "options": ["A", "B", "C", "D"], "answer": "A" },
        { "question": "Next question?", "options": ["A", "B", "C", "D"], "answer": "B" },
        { "question": "Another question?", "options": ["A", "B", "C", "D"], "answer": "C" }
      ]
    }`;
    
    

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    });

    const responseText = result.response.candidates[0].content.parts[0].text;
    console.log("Extracted Response Text:", responseText);
    

    // Parse the response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from Gemini API");
    }

    // Validate the response structure
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      throw new Error("Invalid response format: 'questions' array is missing or invalid");
    }

    // Validate each question in the array
    for (const question of parsedResponse.questions) {
      if (
        !question.question ||
        !question.options ||
        !Array.isArray(question.options) ||
        !question.answer
      ) {
        throw new Error("Invalid question format in response");
      }
    }

    return parsedResponse;
  } catch (error) {
    console.error("Quiz API Error:", error);
    throw new Error("Failed to fetch quiz questions");
  }
};