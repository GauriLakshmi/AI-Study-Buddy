const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Route: POST /api/quizzes/generate
router.post('/generate', quizController.generateQuiz);

module.exports = router;
