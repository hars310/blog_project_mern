const User = require('../../models/User');
const bcrypt = require('bcrypt');

// User Registration Route
const RegisterUser = async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    bio,
    profilePicture,
    dateOfBirth,
    role,
  } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email.' });
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
      bio,
      profilePicture,
      dateOfBirth,
      role, // Default role will be used if not provided
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save the user to the database
    await user.save();

    // Send response back
    res.status(201).json({
      message: 'User registered successfully!',
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = RegisterUser;
