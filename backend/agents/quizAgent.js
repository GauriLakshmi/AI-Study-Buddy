const { generateText } = require('ai');
const { models } = require('../config/models');

/**
 * Generates a quiz with multiple-choice questions for a given topic, difficulty, and question count.
 * @param {string} topic The quiz topic
 * @param {string} difficulty The difficulty level (Beginner, Intermediate, Advanced)
 * @param {number} numQuestions The number of questions to generate
 * @returns {Promise<Array>} Array of quiz question objects
 */
async function runQuizAgent(topic, difficulty, numQuestions) {
  const result = await generateText({
    model: models.quiz,
    maxTokens: 2500,
    maxOutputTokens: 2500,
    system: `
You are an expert quiz generator.
Your job is to generate a multiple-choice quiz about the user's topic and difficulty level.
Since you have access to real-time search, search the web to verify the latest, up-to-date facts when generating questions about current events, people, or recent updates.

Requirements:
- Generate exactly ${numQuestions} questions.
- Each question must have exactly 4 options.
- Only one option must be the correct answer.
- The options should be diverse and plausible, but only one option must be correct.
- Return the response as a valid raw JSON array of objects. Do not include markdown code blocks (like \`\`\`json) or any extra text.

JSON Schema:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The exact string of the correct option (must be one of the strings inside options array)",
    "explanation": "A brief explanation of why this answer is correct"
  }
]
`,
    prompt: `Generate a ${difficulty} level quiz with exactly ${numQuestions} questions about this topic: ${topic}`,
  });

  let cleanText = result.text.trim();
  
  // Strip any markdown code block wraps if the model included them
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse quiz AI output to JSON:', cleanText);
    throw new Error('AI generated invalid quiz formatting. Please try again.');
  }
}

module.exports = { runQuizAgent };
