const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('auth-token');

  // Check if token is not provided
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user payload from the token to the req object
    req.user = decoded;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
