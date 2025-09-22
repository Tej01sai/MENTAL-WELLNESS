// Example sentiment analysis logic
const analyzeSentiment = async (text) => {
  // Replace with actual AI model logic (e.g., VADER, Hugging Face, etc.)
  const sentiments = ['positive', 'neutral', 'negative'];
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  return randomSentiment;
};

// Keep backward compatibility with routes expecting analyzeText
const analyzeText = analyzeSentiment;

module.exports = { analyzeSentiment, analyzeText };