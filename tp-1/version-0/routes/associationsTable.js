const express = require('express');
const router = express.Router();
const associationsController = require('../controllers/associationsTable');

router.get('/', associationsController.getAssociations);

module.exports = router;
