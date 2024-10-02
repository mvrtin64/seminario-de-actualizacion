const express = require('express');
const router = express.Router();
const actionController = require('../controllers/action');

router.get('/', actionController.getAllActions);
router.post('/', actionController.createAction);
router.get('/:id', actionController.getActionById);
router.put('/:id', actionController.updateAction);
router.delete('/:id', actionController.deleteAction);
router.get('/names', actionController.getActionNames);

module.exports = router;
