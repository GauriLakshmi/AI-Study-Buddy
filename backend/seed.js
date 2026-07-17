require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Deck = require('./models/Deck');

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully.');

    const defaultUserId = '60d5ecb8b51d482c3c9c9f8a';
    const defaultDeckId = '60d5ecb8b51d482c3c9c9f8b';

    // 1. Seed User
    let user = await User.findById(defaultUserId);
    if (!user) {
      console.log('Default user not found. Creating default user...');
      user = new User({
        _id: defaultUserId,
        name: 'Study Buddy User',
        email: 'default.user@studybuddy.com'
      });
      await user.save();
      console.log('Default user created:', user);
    } else {
      console.log('Default user already exists:', user);
    }

    // 2. Seed Deck
    let deck = await Deck.findById(defaultDeckId);
    if (!deck) {
      console.log('Default deck not found. Creating default deck...');
      deck = new Deck({
        _id: defaultDeckId,
        name: 'General Study',
        userId: defaultUserId
      });
      await deck.save();
      console.log('Default deck created:', deck);
    } else {
      console.log('Default deck already exists:', deck);
    }

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
