import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const DEFAULT_USER_ID = '60d5ecb8b51d482c3c9c9f8a';
const DEFAULT_DECK_ID = '60d5ecb8b51d482c3c9c9f8b';

export default function useResearch() {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState('idle'); // 'idle', 'researching', 'drafting', 'reviewing', 'completed'
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getResearchResults(DEFAULT_USER_ID);
      // Sort history by date descending
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistory(sorted);
    } catch (err) {
      console.error('Failed to load research history:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load research history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectResult = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getResearchResult(id);
      setSelectedResult({
        ...data,
        isHistorical: true,
        content: data.content,
      });
    } catch (err) {
      console.error('Failed to fetch research result:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load research details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startResearch = useCallback(async (topic) => {
    if (!topic || !topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setPipelineStep('researching');

    // Simulate progressive status changes because the backend runs in a single call.
    const steps = ['researching', 'drafting', 'reviewing'];
    let currentStepIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        setPipelineStep(steps[currentStepIndex]);
      }
    }, 8000);

    try {
      const response = await api.runResearchPipeline({
        topic: topic.trim(),
        userId: DEFAULT_USER_ID,
        deckId: DEFAULT_DECK_ID,
      });

      clearInterval(interval);
      setPipelineStep('completed');

      const newRecord = response.result;
      const details = response.pipelineDetails;

      const enrichedResult = {
        ...newRecord,
        isHistorical: false,
        researchNotes: details.researchNotes,
        draft: details.draft,
        reviewResult: details.reviewResult,
      };

      setSelectedResult(enrichedResult);
      setHistory((prev) => [newRecord, ...prev]);
    } catch (err) {
      clearInterval(interval);
      setPipelineStep('idle');
      console.error('Error running research pipeline:', err);
      setError(err.response?.data?.error || err.message || 'Failed to execute research pipeline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteResult = useCallback(async (id) => {
    setError(null);
    try {
      await api.deleteResearchResult(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      if (selectedResult && selectedResult._id === id) {
        setSelectedResult(null);
      }
    } catch (err) {
      console.error('Failed to delete research result:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete research result');
    }
  }, [selectedResult]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    selectedResult,
    isLoading,
    pipelineStep,
    error,
    setSelectedResult,
    startResearch,
    deleteResult,
    selectResult,
    loadHistory,
  };
}
