const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/names', userController.getUserNames);

module.exports = router;
