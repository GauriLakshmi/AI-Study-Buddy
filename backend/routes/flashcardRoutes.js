const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

// Routes for /api/flashcards
router.get('/', flashcardController.getFlashcards);
router.post('/', flashcardController.createFlashcard);

// Routes for /api/flashcards/:id
router.get('/:id', flashcardController.getFlashcardById);
router.put('/:id', flashcardController.updateFlashcard);
router.delete('/:id', flashcardController.deleteFlashcard);

// Route for generation
router.post('/generate', flashcardController.generateFlashcards);

module.exports = router;
