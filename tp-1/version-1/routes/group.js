const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');

router.get('/', groupController.getAllGroups);
router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.get('/names', groupController.getGroupNames);

module.exports = router;
