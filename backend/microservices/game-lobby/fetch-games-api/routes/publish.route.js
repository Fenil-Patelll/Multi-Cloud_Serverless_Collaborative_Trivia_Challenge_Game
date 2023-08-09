const express = require('express');
const { publishMessage } = require('../controllers/publish.controller');

const router = express.Router();

router.post('/', publishMessage);

module.exports = router;
