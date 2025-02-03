const express = require('express');
const { authenticateToken, getUserProfile,allUsers, updateUserRole,deleteUser ,getAuthorName} = require('../../middlewares/user');

const router = express.Router();

// Profile route
router.get('/profile', authenticateToken, getUserProfile);
router.get('/all-users',authenticateToken,allUsers)
router.put('/update-role/:id', authenticateToken, updateUserRole);
router.delete('/:userId',authenticateToken,deleteUser)
router.get('/user/:id',authenticateToken,getAuthorName)

module.exports = router;
