const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Middleware to check if the user is the author or admin
const checkAuthorOrAdmin = async (req, res, next) => {
  try {
    // Extract token from authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    // console.log(token)
    if (!token) {
      console.log('No token provided. Please log in');
      return res
        .status(403)
        .json({ message: 'No token provided. Please log in.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user from the database
    const user = await User.findById(userId);
    // console.log("here user",userId)
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (user.role === 'reader') {
      return res
        .status(202)
        .json({ message: "You are reader, you can't create posts" });
      console.log("You are reader, you can't create posts");
    }

    
    // Attach the user object to the request for further use
    req.user = user;
    // req.blog = blog;

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {checkAuthorOrAdmin};
