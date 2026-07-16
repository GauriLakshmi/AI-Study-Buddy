const mongoose = require('mongoose');

const researchResultSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ResearchResult = mongoose.model('ResearchResult', researchResultSchema);

module.exports = ResearchResult;
