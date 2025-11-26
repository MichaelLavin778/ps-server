const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secret key for JWT - must be set in production
// For development, generate a random secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable must be set in production');
  }
  console.warn('WARNING: Using generated JWT secret for development. Set JWT_SECRET environment variable for production.');
  return crypto.randomBytes(32).toString('hex');
})();
const JWT_EXPIRATION = '24h';

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Middleware to validate JWT token from Authorization header
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken
};
