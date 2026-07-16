const Deck = require('../models/Deck');

// GET /api/decks - Fetch all decks for a userId
exports.getDecks = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
    const decks = await Deck.find({ userId });
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/decks - Create a new deck
exports.createDeck = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'name and userId are required' });
    }
    const newDeck = new Deck({ name, userId });
    const savedDeck = await newDeck.save();
    res.status(201).json(savedDeck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/decks/:id - Fetch a single deck by ID
exports.getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/decks/:id - Update name of a deck
exports.updateDeck = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required to update' });
    }
    const updatedDeck = await Deck.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedDeck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json(updatedDeck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/decks/:id - Delete a deck
exports.deleteDeck = async (req, res) => {
  try {
    const deletedDeck = await Deck.findByIdAndDelete(req.params.id);
    if (!deletedDeck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json({ message: 'Deck deleted successfully', deck: deletedDeck });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
