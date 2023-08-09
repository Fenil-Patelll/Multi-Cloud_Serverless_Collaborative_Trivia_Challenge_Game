const express = require('express');
const router = express.Router();
const { subscribeToSSE } = require('../controllers/sse.controller');

router.get('/', subscribeToSSE);

module.exports = router;