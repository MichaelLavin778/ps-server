const { generateToken } = require('../middleware/jwtUtils');

/**
 * Handle POST /auth/token - Generate a JWT token
 * In a real application, this would validate credentials first
 */
async function handleGenerateToken(req, res) {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username required'
      });
    }
    
    // In production, you would validate credentials against a user database
    // For this demo, we'll generate a token for any username
    const payload = {
      username,
      timestamp: Date.now()
    };
    
    const token = generateToken(payload);
    
    res.status(200).json({
      success: true,
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Error in handleGenerateToken:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate token'
    });
  }
}

module.exports = {
  handleGenerateToken
};
