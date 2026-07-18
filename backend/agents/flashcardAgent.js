const { generateText } = require('ai');
const { models } = require('../config/models');

/**
 * Generates flashcards for a given topic.
 * @param {string} topic The topic to generate flashcards for
 * @param {number} numCards The number of cards to generate (default 10)
 * @returns {Promise<Array>} Array of flashcard objects: { question, answer }
 */
async function runFlashcardAgent(topic, numCards = 10) {
  const result = await generateText({
    model: models.quiz, // Use the search-enabled model for high accuracy
    maxTokens: 2500,
    maxOutputTokens: 2500,
    system: `
You are an expert educational flashcard creator.
Your job is to generate a set of flashcards to help study the user's topic.
Since you have access to real-time search, search the web to verify the latest, up-to-date facts when generating flashcards about recent events, concepts, or technical details.

Requirements:
- Generate exactly ${numCards} flashcards.
- Each flashcard must have a concise, clear question on the front, and a comprehensive, easy-to-understand explanation or answer on the back.
- Return the response as a valid raw JSON array of objects. Do not include markdown code blocks (like \`\`\`json) or any extra text.

JSON Schema:
[
  {
    "question": "Clear and focused question",
    "answer": "Comprehensive yet digestible answer explanation"
  }
]
`,
    prompt: `Generate exactly ${numCards} flashcards about this topic: ${topic}`,
  });

  let cleanText = result.text.trim();
  
  // Strip any markdown code block wraps if the model included them
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse flashcard AI output to JSON:', cleanText);
    throw new Error('AI generated invalid flashcard formatting. Please try again.');
  }
}

module.exports = { runFlashcardAgent };
