const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Route to get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Route to get all users (Admin only)
const allUsers = async (req, res) => {
  try {
    // Ensure only admins can access this route
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    // Fetch all users excluding passwords
    const users = await User.find({}, '-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can update roles.' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!['reader', 'author', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User role updated successfully.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const deleteUser = async(req,res) =>{
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
}

const getAuthorName=async(req,res)=>{
  try {
    const user = await User.findById(req.params.authorId).select('name');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
}

module.exports = { authenticateToken, getUserProfile, allUsers, updateUserRole,deleteUser,getAuthorName };

