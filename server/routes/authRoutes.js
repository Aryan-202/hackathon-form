const express = require('express');
const { loginAdmin, logoutAdmin, verifyToken, getCurrentAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me',verifyToken, getCurrentAdmin)

module.exports = router;