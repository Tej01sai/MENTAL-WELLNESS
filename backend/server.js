const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

// Ultra-minimal middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Basic health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Mental Wellness AI API is running',
    timestamp: new Date().toISOString()
  });
});

// Test login endpoint - accepts any credentials
app.post('/login', (req, res) => {
  const { identifier, username, email, password } = req.body || {};
  const userIdentifier = identifier || username || email;
  
  if (!userIdentifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }
  
  // Accept any credentials for testing
  return res.json({ 
    message: 'Login successful', 
    username: userIdentifier,
    email: userIdentifier,
    testMode: true
  });
});

// Test register endpoint
app.post('/register', (req, res) => {
  const { username, email, password } = req.body || {};
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  
  return res.json({ 
    message: 'Registration successful', 
    user: { username, email },
    testMode: true
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Minimal server running on port ${port}`);
  console.log(`🌍 Server accessible at: http://0.0.0.0:${port}`);
  console.log(`✅ Railway minimal deployment ready!`);
});