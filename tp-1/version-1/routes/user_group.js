const express = require('express');
const router = express.Router();
const userGroupController = require('../controllers/user_group');

router.get('/', userGroupController.getAllUserGroups);
router.post('/', userGroupController.createUserGroup);
router.delete('/:userId/:groupId', userGroupController.deleteUserGroup);

module.exports = router;
