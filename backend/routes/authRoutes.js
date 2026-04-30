const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// ✅ GET USER BY ID
router.get('/:id', authController.getUser);

// ✅ UPDATE USER
router.put('/:id', authController.updateUser);

module.exports = router;
