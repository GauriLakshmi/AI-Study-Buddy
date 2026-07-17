const { runQuizAgent } = require('../agents/quizAgent');

/**
 * POST /api/quizzes/generate
 * Generates a quiz based on topic and difficulty from request body.
 */
exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'topic and difficulty are required' });
    }

    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validLevels.includes(difficulty)) {
      return res.status(400).json({ error: 'difficulty must be Beginner, Intermediate, or Advanced' });
    }

    // Default to 5 questions if not specified, clamp to reasonable bounds
    const parsedNumQuestions = parseInt(numQuestions, 10) || 5;

    console.log(`Generating a ${difficulty} quiz with ${parsedNumQuestions} questions on topic: "${topic}"...`);
    const quiz = await runQuizAgent(topic, difficulty, parsedNumQuestions);
    
    res.status(200).json({
      success: true,
      topic,
      difficulty,
      quiz
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message });
  }
};
