import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

  
// GET route: display the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// POST route: receive a question and return an AI answer
app.post("/ask", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in the .env file."
      });
    }

    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: question.trim()
    });

    return res.json({
      answer: response.text || "No answer was generated."
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);

    return res.status(500).json({
      error: "Unable to generate an answer. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



