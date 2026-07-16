const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deckController');

// Routes for /api/decks
router.get('/', deckController.getDecks);
router.post('/', deckController.createDeck);

// Routes for /api/decks/:id
router.get('/:id', deckController.getDeckById);
router.put('/:id', deckController.updateDeck);
router.delete('/:id', deckController.deleteDeck);

module.exports = router;
