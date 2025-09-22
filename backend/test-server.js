const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

console.log(`🔍 Environment check:`);
console.log(`- PORT: ${process.env.PORT}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- Starting on port: ${port}`);

// Simple CORS for testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Simple test endpoint
app.get('/', (req, res) => {
  console.log('📡 Root endpoint hit');
  res.json({ status: 'ok', message: 'Railway backend is working!', port: port });
});

app.get('/test', (req, res) => {
  console.log('📡 Test endpoint hit');
  res.json({ 
    status: 'success', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Simple login test (no database)
app.post('/login', (req, res) => {
  console.log('📡 Login endpoint hit');
  res.json({ 
    status: 'success', 
    message: 'Login endpoint reached successfully',
    data: req.body 
  });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`✅ CORS enabled for all origins`);
  console.log(`🌐 Server bound to 0.0.0.0:${port}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});