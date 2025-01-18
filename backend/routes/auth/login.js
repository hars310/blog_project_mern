const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// User Login Route
const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token (valid for 1 hour, you can adjust the time)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      },
    );

    // Send the token in the response
    res.status(200).json({
      message: 'Login successful!',
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = LoginUser;
