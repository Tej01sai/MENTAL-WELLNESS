const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

// Simple CORS for testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Railway backend is working!' });
});

app.get('/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString() 
  });
});

// Simple login test (no database)
app.post('/login', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Login endpoint reached successfully',
    data: req.body 
  });
});

app.listen(port, () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`✅ CORS enabled for all origins`);
});