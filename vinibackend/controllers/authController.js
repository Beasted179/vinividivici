const jwt = require('jsonwebtoken');
const { validateApiKey } = require('./authUtils'); 


async function authenticate(req, res) {
  try {
    const { apiKey } = req.body;

    const isValidApiKey = await validateApiKey(apiKey);
    
    if (!isValidApiKey) {
      return res.status(401).json({ message: 'Authentication denied.' });
    }

    // Generate JWT token
    const token = jwt.sign({ apiKey }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ token, message: 'Authentication successful.' });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Authentication failed.' });

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token verification failed.' });
    req.user = user;
    next();
  });
}

module.exports = {
  authenticate,
  authenticateToken,
};
