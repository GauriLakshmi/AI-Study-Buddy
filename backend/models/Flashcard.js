const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['Hard', 'Good', 'Easy', 'Unstudied'],
    default: 'Unstudied'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
