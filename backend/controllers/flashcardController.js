const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');
const { runFlashcardAgent } = require('../agents/flashcardAgent');

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

// PUT /api/flashcards/:id - Update a flashcard (question, answer, bookmarked, and/or difficulty)
exports.updateFlashcard = async (req, res) => {
  try {
    const { question, answer, bookmarked, difficulty } = req.body;
    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (bookmarked !== undefined) updateData.bookmarked = bookmarked;
    if (difficulty !== undefined) updateData.difficulty = difficulty;

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

// POST /api/flashcards/generate - Generate flashcards for a topic and save to a deck
exports.generateFlashcards = async (req, res) => {
  try {
    const { topic, userId, deckId, numCards } = req.body;
    if (!topic || !userId) {
      return res.status(400).json({ error: 'topic and userId are required' });
    }

    let targetDeckId = deckId;
    let deckName = topic;
    
    // If deckId is not provided, create a new Deck
    if (!targetDeckId) {
      const newDeck = new Deck({
        name: topic,
        userId: userId
      });
      const savedDeck = await newDeck.save();
      targetDeckId = savedDeck._id;
      deckName = savedDeck.name;
    } else {
      const existingDeck = await Deck.findById(targetDeckId);
      if (existingDeck) {
        deckName = existingDeck.name;
      }
    }

    const count = parseInt(numCards, 10) || 10;
    console.log(`Generating ${count} flashcards for topic: "${topic}"...`);
    
    const cardsData = await runFlashcardAgent(topic, count);
    
    // Save generated cards to the database
    const cardsToSave = cardsData.map(card => ({
      question: card.question,
      answer: card.answer,
      deckId: targetDeckId
    }));
    
    const savedCards = await Flashcard.insertMany(cardsToSave);

    res.status(201).json({
      success: true,
      message: 'Flashcards generated successfully',
      deckId: targetDeckId,
      deckName: deckName,
      flashcards: savedCards
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: error.message });
  }
};
