const express = require('express');
const { registerUser, loginUser, updateUser, getUserDetails,getAllUsers,} = require('../controllers/userController');
const auth = require('../middleware/auth');  // Protect route

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', auth, updateUser);
router.get('/profile', auth, getUserDetails);
router.get('/getusers', auth,getAllUsers);

module.exports = router;
