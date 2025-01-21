const express = require('express');
const { authenticateToken, getUserProfile } = require('../../middlewares/user');

const router = express.Router();

// Profile route
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
