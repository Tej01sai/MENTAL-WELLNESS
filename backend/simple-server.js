require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 8000;

// Simple CORS - allow all origins for now
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

// MongoDB setup
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://sai727868:Sai1234@cluster0.p1wnggu.mongodb.net/mental_wellness?retryWrites=true&w=majority&appName=Cluster0';
let usersCollection;
let database;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mental Wellness API is running!',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URL, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
    });
    await client.connect();
    database = client.db('mental_wellness');
    usersCollection = database.collection('users');
    console.log('✅ MongoDB connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    
    if (!usersCollection) {
      return res.status(500).json({ message: 'Database not connected' });
    }

    // Check if user exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      username,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!usersCollection) {
      return res.status(500).json({ message: 'Database not connected' });
    }

    // Find user by email, username, or phone
    const user = await usersCollection.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user data (without password)
    const { password: _, ...userData } = user;
    res.json({
      message: 'Login successful',
      username: user.username,
      email: user.email,
      phone: user.phone
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Start server
async function startServer() {
  // Connect to MongoDB (but don't fail if it doesn't work)
  await connectToMongoDB();
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 MongoDB: ${usersCollection ? 'Connected' : 'Disconnected'}`);
  });
}

startServer().catch(error => {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
});