const express = require('express');
const router = express.Router();
const emotionController = require('../Controllers/emotionComtroller');

router.post('/emotions', emotionController.receiveEmotion);
router.get('/emotions', emotionController.getEmotionCounts);

module.exports = router;