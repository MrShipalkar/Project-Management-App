const express = require('express');
const { registerUser, loginUser, updateUser } = require('../controllers/userController');
const auth = require('../middleware/auth');  // Protect route

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', auth, updateUser);

module.exports = router;
