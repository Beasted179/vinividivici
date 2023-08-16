const jwt = require('jsonwebtoken');
const { validateApiKey } = require('./authUtils');
require('dotenv').config({ path: '../.env' }); // Load environment variables from .env file

async function authenticate(req, res) {
  try {
    const { apiKey } = req.body;
    const isValidApiKey = await validateApiKey(apiKey);
    
    if (!isValidApiKey) {
      return res.status(401).json({ message: 'Authentication denied.' });
    }
    
    // Generate JWT token using a fixed secret key without expiration
    const token = jwt.sign({ apiKey }, process.env.JWT_SECRET);

    res.json({ token, message: 'Authentication successful.' });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
}


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Authentication has failed.' });

  // Verify JWT token using the same fixed secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired.' });
      }
      return res.status(403).json({ error: 'Token verification failed.' });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  authenticate,
  authenticateToken,
};

