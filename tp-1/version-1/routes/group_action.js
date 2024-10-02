const express = require('express');
const router = express.Router();
const groupActionController = require('../controllers/group_action');

router.post('/', groupActionController.createGroupAction);
router.delete('/:groupId/:actionId', groupActionController.deleteGroupAction);

module.exports = router;
