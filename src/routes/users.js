const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// NUEVOS ENDPOINTS:
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Opcionales para SMS (depende si implementas esta parte)
router.post('/send-code', userController.sendCode);
router.post('/verify-phone', userController.verifyCode);

module.exports = router;
