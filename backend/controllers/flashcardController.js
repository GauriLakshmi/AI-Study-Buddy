const Flashcard = require('../models/Flashcard');

// GET /api/flashcards - Fetch flashcards, optionally filtered by deckId
exports.getFlashcards = async (req, res) => {
  try {
    const { deckId } = req.query;
    const query = deckId ? { deckId } : {};
    const flashcards = await Flashcard.find(query);
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/flashcards - Create a new flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { question, answer, deckId } = req.body;
    if (!question || !answer || !deckId) {
      return res.status(400).json({ error: 'question, answer, and deckId are required' });
    }
    const newFlashcard = new Flashcard({ question, answer, deckId });
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/flashcards/:id - Fetch a single flashcard by ID
exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.status(200).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/flashcards/:id - Update a flashcard (question and/or answer)
exports.updateFlashcard = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedFlashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.status(200).json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/flashcards/:id - Delete a flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!deletedFlashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.status(200).json({ message: 'Flashcard deleted successfully', flashcard: deletedFlashcard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
