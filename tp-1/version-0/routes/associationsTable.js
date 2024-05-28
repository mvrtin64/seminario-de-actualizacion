const express = require('express');
const router = express.Router();
const associationsController = require('../controllers/associationsTable');

router.get('/', associationsController.getAssociations);
router.put('/:userId/:groupId', associationsController.updateAssociation);

module.exports = router;
