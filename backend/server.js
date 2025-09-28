require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Set DNS servers to fix MongoDB connection issues
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Use Google and Cloudflare DNS

const app = express();
const port = process.env.PORT || 8000;

// Initialize OpenAI with error handling
let openai = null;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is not set. Chat and stress analysis will use fallback responses.');
  } else {
    openai = new OpenAI({ apiKey: (process.env.OPENAI_API_KEY || '').trim() });
    const masked = (process.env.OPENAI_API_KEY || '').trim();
    console.log(`OPENAI_API_KEY detected (len=${masked.length}, prefix=${masked.slice(0,6)})`);
  }
} catch (error) {
  console.error('OpenAI initialization failed:', error.message);
  console.warn('Continuing without OpenAI - will use fallback responses');
}

// Middleware
app.use(express.json());

// CORS configuration to allow all your domains
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'https://tejj.me',
      'https://www.tejj.me', 
      'https://mental-wellness-xi.vercel.app',
      'https://mental-wellness-git-main-sai-tejas-projects-2a2e36c4.vercel.app',
      'https://mental-wellness-5xgj64mvv-sai-tejas-projects-2a2e36c4.vercel.app',
      'http://localhost:3000', // For local development
      'http://localhost:3001'  // For local development
    ];

console.log('🌐 Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: true, // Allow all origins for now to debug
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));
// File upload handler for image analysis (multipart/form-data)
const upload = multer({ storage: multer.memoryStorage() });

// MongoDB connection (mirror Python FastAPI setup)
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://sai727868:Sai1234@cluster0.p1wnggu.mongodb.net/mental_wellness?retryWrites=true&w=majority';
const DATABASE_NAME = process.env.DATABASE_NAME || 'mental_wellness';
let usersCollection;
let mongoClient;
let database;

async function connectToMongoDB() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    mongoClient = new MongoClient(MONGODB_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    await mongoClient.connect();
    await mongoClient.db(DATABASE_NAME).admin().ping();
    
    database = mongoClient.db(DATABASE_NAME);
    usersCollection = database.collection('users');
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📁 Database: ${DATABASE_NAME}`);
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('🔧 Make sure your MongoDB Atlas cluster is running and network access is configured');
    database = null;
    usersCollection = null;
    return false;
  }
}

/**
 * Analyze stress levels using OpenAI or fallback
 */
async function analyzeStress(text) {
  try {
    if (!openai) {
      // Fallback: simple keyword-based analysis
      const stressKeywords = ['stress', 'anxious', 'worried', 'panic', 'overwhelmed', 'depressed', 'sad'];
      const words = text.toLowerCase().split(' ');
      const stressCount = words.filter(word => stressKeywords.some(keyword => word.includes(keyword))).length;
      const stressLevel = Math.min(100, stressCount * 25);
      
      return {
        stressLevel,
        confidence: 60,
        suggestion: "Take deep breaths and try to focus on positive thoughts."
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
      return JSON.parse(aiResponse);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return { stressLevel: 0, confidence: 0, suggestion: "Unable to analyze stress properly." };
    }
  } catch (error) {
    console.error("Error analyzing stress:", error?.response?.data || error?.message || error);
    return { stressLevel: 0, confidence: 0, suggestion: "Unable to analyze stress right now." };
  }
}

/**
 * Generate chatbot response using OpenAI or fallback
 */
async function chatWithAI(text) {
  try {
    if (!openai) {
      // Fallback responses
      const responses = [
        "I'm here to support you. How are you feeling today?",
        "That sounds challenging. Would you like to talk about it?",
        "Remember to take care of yourself. What helps you feel better?",
        "I understand this might be difficult. You're not alone in this.",
        "Thank you for sharing. What would help you feel more at peace right now?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
    console.error("Error generating chat response:", error?.response?.data || error?.message || error);
    return "I'm here to help, but I couldn't process your request right now. How are you feeling?";
  }
}

// ---------------------------------------------------------------------------
// Routes mirrored from Python FastAPI to preserve paths and behavior
// ---------------------------------------------------------------------------

// Health root
app.get('/', (req, res) => {
  res.json({ status: 'healthy', message: 'Mental Wellness AI API is running' });
});

// Detailed health (checks DB)
app.get('/health', async (req, res) => {
  try {
    if (!usersCollection) throw new Error('DB not initialized');
    await usersCollection.findOne({ _id: null }); // lightweight ping
    return res.json({ status: 'healthy', database: 'connected', message: 'Mental Wellness AI API' });
  } catch (e) {
    return res.json({ status: 'healthy', database: `error: ${e.message}`, message: 'Mental Wellness AI API' });
  }
});

// Register (same path as Python: POST /register)
app.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    if (!usersCollection) {
      return res.status(500).json({ message: 'Database not ready' });
    }
    const existing = await usersCollection.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'User with username or email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, email, phone: phone || null, password: hashed, createdAt: new Date() });
    return res.json({ message: 'Registration successful', user: { username, email, phone: phone || null } });
  } catch (e) {
    console.error('Register error:', e);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// Login (same path as Python: POST /login)
app.post('/login', async (req, res) => {
  try {
    const { identifier, username, email, password } = req.body || {};
    const userIdentifier = identifier || username || email;
    if (!userIdentifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }
    if (!usersCollection) {
      return res.status(500).json({ message: 'Database not ready' });
    }
    const user = await usersCollection.findOne({ $or: [{ username: userIdentifier }, { email: userIdentifier }] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ message: 'Login successful', username: user.username, email: user.email, phone: user.phone || null });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// Chat (same path signature as Python chatbot: POST /chat)
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const reply = await chatWithAI(message);
    // For parity with Python chatbot.py that also returned stress_level
    const stress = await analyzeStress(message);
    return res.json({ reply, stress_level: typeof stress.stressLevel === 'number' ? Math.round(stress.stressLevel) : 0 });
  } catch (e) {
    console.error('Chat error:', e);
    return res.status(500).json({ error: 'Failed to process message.' });
  }
});

// Detect stress (same as Python: POST /detect-stress/)
app.post('/detect-stress/', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text) {
      return res.status(400).json({ detail: 'Text input is required' });
    }
    const emotions = await analyzeStress(text);
    // Map to Python response shape: { stress_level: number, emotions: [...] }
    const stressLevel = Math.max(0, Math.min(100, Number(emotions.stressLevel || 0)));
    return res.json({ stress_level: stressLevel, emotions });
  } catch (e) {
    console.error('Detect stress error:', e);
    return res.status(500).json({ detail: 'Failed to analyze stress level.' });
  }
});

// Analyze emotion from image (same as Python: POST /analyze_emotion/ with multipart file)
app.post('/analyze_emotion/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ error: 'Invalid image format' });
    }
    
    // For now, return a simple response since OpenAI vision API needs different approach
    const emotions = ['happy', 'sad', 'angry', 'fear', 'neutral', 'surprised', 'disgust'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const highStress = ['sad', 'angry', 'fear'];
    const stress_level = highStress.includes(randomEmotion) ? 'High' : 'Low';
    
    return res.json({ 
      emotion: randomEmotion, 
      stress_level,
      message: 'Image analysis placeholder - working on vision API integration'
    });
  } catch (e) {
    console.error('Analyze emotion error:', e);
    return res.json({ error: String(e.message || e) });
  }
});

// Legacy route used by Chat UI: POST /api/send-message
// Preserves previous frontend behavior by returning { result, stressAnalysis }
app.post('/api/send-message', async (req, res) => {
  const { message, username } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  try {
    const result = await chatWithAI(message);
    const stressAnalysis = await analyzeStress(message);
    try {
      if (database && username) {
        console.log('💾 Logging conversation to database...');
        const logs = database.collection('chat_logs');
        const users = database.collection('users');
        
        // Insert chat log
        await logs.insertOne({
          username,
          message,
          reply: result,
          stressLevel: Number(stressAnalysis?.stressLevel || 0),
          confidence: Number(stressAnalysis?.confidence || 0),
          suggestion: stressAnalysis?.suggestion || '',
          createdAt: new Date(),
          sessionId: req.sessionID || 'anonymous'
        });
        
        // Update user's conversation count
        await users.updateOne(
          { username },
          { 
            $inc: { conversationCount: 1 },
            $set: { lastChatAt: new Date() }
          },
          { upsert: true }
        );
        
        console.log('✅ Chat logged successfully');
      } else {
        console.warn('⚠️ Skipping chat logging - database unavailable or no username');
      }
    } catch (logErr) {
      console.error('❌ Chat logging failed:', logErr.message);
      console.error('💡 Chat will still work, but conversation tracking is disabled');
    }
    return res.json({ result, stressAnalysis });
  } catch (e) {
    console.error('send-message error:', e);
    return res.status(500).json({ error: 'Failed to process message.' });
  }
});

// Enhanced analytics endpoint with conversation tracking
app.get('/analytics/:username', async (req, res) => {
  try {
    if (!database) {
      return res.status(500).json({ error: 'Database not ready' });
    }
    
    const logs = database.collection('chat_logs');
    const users = database.collection('users');
    const username = req.params.username;
    
    // Get user info with conversation count
    const userInfo = await users.findOne({ username }) || { conversationCount: 0 };
    
    // Check if user has enough conversations for meaningful results
    if (userInfo.conversationCount < 3) {
      return res.json({
        hasEnoughData: false,
        conversationCount: userInfo.conversationCount,
        requiredConversations: 3,
        message: `You need ${3 - userInfo.conversationCount} more conversations to see your wellness insights.`
      });
    }
    
    // Get detailed analytics
    const [overview] = await logs.aggregate([
      { $match: { username } },
      { $group: { 
        _id: null, 
        avgStress: { $avg: '$stressLevel' },
        maxStress: { $max: '$stressLevel' },
        minStress: { $min: '$stressLevel' },
        totalChats: { $sum: 1 },
        avgConfidence: { $avg: '$confidence' }
      }}
    ]).toArray();
    
    // Stress level distribution for pie chart
    const stressDistribution = await logs.aggregate([
      { $match: { username } },
      { 
        $bucket: { 
          groupBy: '$stressLevel', 
          boundaries: [0, 25, 50, 75, 100], 
          default: 'High',
          output: { count: { $sum: 1 } } 
        } 
      }
    ]).toArray();
    
    // Stress trend over time for line chart
    const stressTrend = await logs.aggregate([
      { $match: { username } },
      { $sort: { createdAt: 1 } },
      { 
        $project: { 
          stressLevel: 1, 
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          chatNumber: 1
        } 
      }
    ]).toArray();
    
    // Recent suggestions
    const recentSuggestions = await logs.aggregate([
      { $match: { username, suggestion: { $ne: '' } } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      { $project: { suggestion: 1, stressLevel: 1, createdAt: 1 } }
    ]).toArray();
    
    // Format stress distribution for charts
    const chartData = stressDistribution.map((bucket, index) => {
      const labels = ['Low (0-25)', 'Moderate (25-50)', 'High (50-75)', 'Very High (75-100)'];
      const colors = ['#10B981', '#F59E0B', '#EF4444', '#7C2D12'];
      return {
        label: labels[index] || 'High',
        value: bucket.count,
        color: colors[index] || '#7C2D12'
      };
    });
    
    return res.json({
      hasEnoughData: true,
      conversationCount: userInfo.conversationCount,
      overview: overview || {},
      stressDistribution: chartData,
      stressTrend: stressTrend.map((item, index) => ({
        chatNumber: index + 1,
        stressLevel: item.stressLevel,
        date: item.date
      })),
      recentSuggestions,
      insights: {
        averageStressCategory: overview?.avgStress < 25 ? 'Low' : 
                              overview?.avgStress < 50 ? 'Moderate' : 
                              overview?.avgStress < 75 ? 'High' : 'Very High',
        improvement: stressTrend.length > 1 ? 
          (stressTrend[stressTrend.length - 1].stressLevel < stressTrend[0].stressLevel ? 
           'improving' : 'needs attention') : 'insufficient data'
      }
    });
  } catch (e) {
    console.error('Analytics error:', e);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Keep the old stats endpoint for backward compatibility
app.get('/stats/:username', async (req, res) => {
  return res.redirect(`/analytics/${req.params.username}`);
});

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit in production, just log
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production, just log
});

// Start the server after MongoDB connection
async function startServer() {
  try {
    console.log('🚀 Starting server...');
    
    // Start server first (non-blocking)
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌍 Server accessible at: http://0.0.0.0:${port}`);
      console.log(`✅ Railway deployment successful!`);
    });
    
    // Try MongoDB connection in background (don't block server startup)
    setImmediate(async () => {
      try {
        const mongoConnected = await connectToMongoDB();
        console.log(`📝 MongoDB status: ${mongoConnected ? 'Connected' : 'Disconnected'}`);
      } catch (err) {
        console.log('⚠️ MongoDB connection failed, but server is running:', err.message);
      }
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
