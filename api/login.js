export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { identifier, username, email, password } = req.body || {};
    const userIdentifier = identifier || username || email;
    
    if (!userIdentifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }
    
    console.log('Login attempt for:', userIdentifier);
    
    return res.status(200).json({ 
      message: 'Login successful (Vercel API)', 
      username: userIdentifier,
      email: userIdentifier,
      testMode: true
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
}