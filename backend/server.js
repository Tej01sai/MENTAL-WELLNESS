require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

console.log('🚀 Starting Mental Wellness API...');
console.log(`📍 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Mental Wellness API is running!',
    timestamp: new Date().toISOString(),
    port: port
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Simple login endpoint for testing
app.post('/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { identifier, password } = req.body || {};
  
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }
  
  // Simple test - accept any credentials for now
  res.json({
    message: 'Login successful',
    username: identifier,
    email: identifier + '@test.com',
    note: 'This is a test response - database connection pending'
  });
});

// Simple register endpoint for testing
app.post('/register', (req, res) => {
  console.log('Register attempt:', req.body);
  const { username, email, password } = req.body || {};
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  
  res.json({
    message: 'Registration successful',
    user: { username, email },
    note: 'This is a test response - database connection pending'
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Listening on 0.0.0.0:${port}`);
  console.log(`✅ Express server started successfully!`);
});