require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

console.log('🚀 Initializing minimal server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Port:', port);
console.log('🌍 Platform:', process.platform);
console.log('📦 Node version:', process.version);

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Basic health check
app.get('/', (req, res) => {
  console.log('📞 Health check request received');
  res.json({ 
    status: 'healthy', 
    message: 'Mental Wellness AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: port,
    nodeVersion: process.version
  });
});

// Railway-specific health check
app.get('/health', (req, res) => {
  console.log('🏥 Railway health check');
  res.status(200).json({ 
    status: 'OK',
    service: 'Mental Wellness API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test login endpoint
app.post('/login', (req, res) => {
  try {
    const { identifier, username, email, password } = req.body || {};
    const userIdentifier = identifier || username || email;
    
    if (!userIdentifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }
    
    console.log('Login attempt for:', userIdentifier);
    
    return res.json({ 
      message: 'Login successful (test mode)', 
      username: userIdentifier,
      email: userIdentifier,
      testMode: true
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// Test register endpoint
app.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    console.log('Registration attempt for:', username);
    
    return res.json({ 
      message: 'Registration successful (test mode)', 
      user: { username, email },
      testMode: true
    });
  } catch (e) {
    console.error('Registration error:', e);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Server accessible at: http://0.0.0.0:${port}`);
  console.log(`✅ Railway test deployment ready!`);
  console.log(`🕒 Server started at: ${new Date().toISOString()}`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  console.error('📝 Error code:', error.code);
  console.error('📝 Error message:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  }
});

server.on('listening', () => {
  console.log('👂 Server is listening for connections');
  const addr = server.address();
  console.log('📡 Server address:', addr);
});

console.log('✅ Server setup complete');

// Handle process signals
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});