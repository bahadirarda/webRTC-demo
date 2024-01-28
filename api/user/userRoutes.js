const express = require('express');
const router = express.Router();
const UserController = require('./userController');

// Kullanıcı kayıt endpoint'i
router.post('/signup', UserController.signup);

// Kullanıcı giriş endpoint'i
router.post('/login', UserController.login);

module.exports = router;
