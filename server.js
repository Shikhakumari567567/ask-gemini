import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, "frontend");
const INDEX_FILE = path.join(FRONTEND_DIR, "index.html");

app.use(express.json());
app.use(express.static(FRONTEND_DIR));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Homepage
app.get("/", (req, res) => {
  if (!fs.existsSync(INDEX_FILE)) {
    return res
      .status(500)
      .send("frontend/index.html not found. Push the frontend folder to GitHub.");
  }
  res.sendFile(INDEX_FILE);
});

// Ask route
app.post("/ask", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing. Set it in your environment variables."
      });
    }

    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
  console.log(`Server running on port ${PORT}`);
  console.log("Deployed files:", fs.readdirSync(__dirname));
  console.log("Frontend exists:", fs.existsSync(INDEX_FILE));
});