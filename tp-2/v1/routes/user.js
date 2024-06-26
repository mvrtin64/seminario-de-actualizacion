const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
