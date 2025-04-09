require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(express.json());
app.use(cors()); // 🔥 Fix CORS issue

/**
 * Analyze stress levels using OpenAI
 */
async function analyzeStress(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You analyze stress levels in text. Return JSON format: {\"stressLevel\": [0-100], \"confidence\": [0-100], \"suggestion\": \"Short mental wellness tip\"}. If unsure, estimate stressLevel to the best of your ability." },
        { role: "user", content: `Analyze: "${text}"` }
      ],
      temperature: 0.5
    });

    const aiResponse = response?.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) {
      throw new Error("Invalid response from OpenAI");
    }

    try {
      return JSON.parse(aiResponse); // 🔥 Fix potential JSON parsing error
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return { stressLevel: 0, confidence: 0, suggestion: "Unable to analyze stress properly." };
    }
  } catch (error) {
    console.error("Error analyzing stress:", error);
    return { stressLevel: 0, confidence: 0, suggestion: "Unable to analyze stress right now." };
  }
}

/**
 * Generate chatbot response using OpenAI
 */
async function chatWithAI(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a mental wellness chatbot. Respond in a supportive, concise manner with maximum two sentences." },
        { role: "user", content: text }
      ],
      temperature: 0.7
    });

    const aiResponse = response?.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) {
      throw new Error("Invalid response from OpenAI");
    }

    return aiResponse;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm here to help, but I couldn't process your request right now.";
  }
}

/**
 * API Endpoint: Handle user messages and detect stress levels
 */
app.post('/api/send-message', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Get chatbot reply
    const reply = await chatWithAI(message);

    // Get stress level analysis
    const stressAnalysis = await analyzeStress(message);

    res.json({
      result: reply,
      stressAnalysis,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to process message.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
