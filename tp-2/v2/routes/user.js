const express = require('express');
const { getAllUsers, createUser, loginUser } = require('../controllers/user');
const { cookieJwtAuth } = require('../public/middleware/cookieJwtAuth');

const router = express.Router();

router.get('/', cookieJwtAuth, getAllUsers); 
router.post('/register', createUser); 
router.post('/login', loginUser); 

module.exports = router;
