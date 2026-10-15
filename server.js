const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

// Load .env
dotenv.config({
    path: path.join(__dirname, "Ask Gemini", ".env")
});

const app = express();
const PORT = 3000;

// Check API key
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing.");
    process.exit(1);
}

// Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Middleware
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "Ask Gemini", "frontend")
    )
);

// Ask Gemini route
app.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: question
        });

        const answer = response.text;

        res.json({
            answer
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        res.status(500).json({
            error: "Something went wrong. Please try again."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



































