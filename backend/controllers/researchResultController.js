const ResearchResult = require('../models/ResearchResult');
const { runResearchPipeline } = require('../services/orchestrator');


// GET /api/research-results - Fetch all research results, optionally filtered by userId
exports.getResearchResults = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const results = await ResearchResult.find(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/research-results - Run pipeline and create a research result
exports.createResearchResult = async (req, res) => {
  try {
    const { topic, userId, deckId } = req.body;
    if (!topic || !userId) {
      return res.status(400).json({ error: 'topic and userId are required' });
    }

    // Run the AI pipeline
    const pipelineData = await runResearchPipeline(topic);

    // Create the document
    const newResult = new ResearchResult({
      topic,
      content: pipelineData.reviewResult, // Contains feedback and final draft
      userId,
      deckId
    });

    const savedResult = await newResult.save();
    res.status(201).json({
      message: 'Research pipeline executed successfully',
      result: savedResult,
      pipelineDetails: pipelineData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/research-results/:id - Fetch single research result by ID
exports.getResearchResultById = async (req, res) => {
  try {
    const result = await ResearchResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Research result not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/research-results/:id - Delete a research result
exports.deleteResearchResult = async (req, res) => {
  try {
    const deletedResult = await ResearchResult.findByIdAndDelete(req.params.id);
    if (!deletedResult) {
      return res.status(404).json({ error: 'Research result not found' });
    }
    res.status(200).json({ message: 'Research result deleted successfully', result: deletedResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ResearchPipeline = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'topic is required' });
    }
    const result = await runResearchPipeline(topic);

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
