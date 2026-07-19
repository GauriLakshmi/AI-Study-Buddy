import { useState } from 'react';
import api from '../services/api';

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: selectedOptionText }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic || !topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);

    try {
      const response = await api.generateQuiz({
        topic: topic.trim(),
        difficulty,
        numQuestions
      });
      if (response.success && Array.isArray(response.quiz)) {
        setQuiz(response.quiz);
      } else {
        throw new Error('Invalid quiz format received from server.');
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qIdx, optionText) => {
    if (isSubmitted) return; // Prevent changing answers after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optionText
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted || !quiz) return;

    let calculatedScore = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setQuiz(null);
    setTopic('');
    setDifficulty('Beginner');
    setNumQuestions(5);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setError(null);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Advanced':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <main className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col justify-start relative">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-3xl w-full mx-auto flex-1 flex flex-col">
        
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">quiz</span>
          <div>
            <h2 className="font-headline-xl text-3xl text-on-background tracking-tight">AI Quiz Generator</h2>
            <p className="text-xs text-on-surface-variant mt-1">Test your understanding with instant, custom-made evaluations.</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error-container text-error flex items-start space-x-3">
            <span className="material-symbols-outlined mt-0.5">error</span>
            <div className="flex-1 text-sm font-body-md">{error}</div>
          </div>
        )}

        {/* 1. INITIAL FORM STATE */}
        {!isLoading && !quiz && (
          <div className="w-full glass-level-2 glass-card-border rounded-xl p-8 bg-surface-container-low/50 shadow-xl border border-white/5 mt-4">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-sm font-semibold text-on-background">
                  What topic do you want to be quizzed on?
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., React Hooks, Photosynthesis, French Revolution, Quantum Computing..."
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-white/10 text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-body-md shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="difficulty" className="block text-sm font-semibold text-on-background">
                  Select Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-white/10 text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-body-md shadow-inner cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="numQuestions" className="block text-sm font-semibold text-on-background">
                  Number of Questions
                </label>
                <select
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-white/10 text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-body-md shadow-inner cursor-pointer"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Generate Quiz</span>
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. LOADING STATE */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="relative flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-6xl animate-spin">sync</span>
              <span className="material-symbols-outlined text-primary text-2xl absolute">auto_awesome</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-background mb-2">Creating Your Quiz</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-sm">
              Our AI is drafting {numQuestions} tailored multiple-choice questions on <strong>{topic}</strong> ({difficulty} level)...
            </p>
          </div>
        )}

        {/* 3. ACTIVE QUIZ & SUBMISSION VIEW */}
        {!isLoading && quiz && (
          <div className="space-y-8 mt-2">
            
            {/* Quiz Info Bar */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container border border-white/5">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-on-background truncate">Topic: {topic}</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold border border-white/10 text-on-surface-variant">
                  {quiz.length} Questions
                </span>
              </div>
              <button
                onClick={handleRestart}
                className="text-xs text-primary hover:underline flex items-center space-x-1"
              >
                <span className="material-symbols-outlined text-xs">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>

            {/* Score Summary Panel */}
            {isSubmitted && (
              <div className="glass-level-2 glass-card-border rounded-xl p-8 bg-surface-container-high/90 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="font-headline-xl text-3xl text-on-background">Quiz Completed!</h3>
                  <p className="text-on-surface-variant font-body-md">
                    {score === quiz.length ? 'Perfect score! Outstanding job!' :
                     score >= Math.ceil(quiz.length * 0.6) ? 'Great job! You have a solid understanding.' :
                     'Keep practicing to strengthen your knowledge.'}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center shadow-lg">
                    <span className="font-bold text-4xl text-primary">{score}<span className="text-xl text-primary/70">/{quiz.length}</span></span>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="mt-4 px-6 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all"
                  >
                    Try Another Quiz
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Questions List */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {quiz.map((q, qIdx) => {
                const selectedAnswer = selectedAnswers[qIdx];
                const isQuestionCorrect = selectedAnswer === q.correctAnswer;
                
                return (
                  <div 
                    key={qIdx}
                    className="glass-level-2 glass-card-border rounded-xl p-6 bg-surface-container-low/50 border border-white/5 shadow-md flex flex-col space-y-4"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 
                        className="font-body-lg text-lg text-on-background font-medium flex-1"
                        dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(q.question) }}
                      />
                    </div>

                    {/* Options List */}
                    <div className="grid grid-cols-1 gap-2 pl-9">
                      {q.options.map((option, optIdx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption = option === q.correctAnswer;

                        let optionStyle = 'bg-surface-container-lowest border-white/5 text-on-surface-variant hover:bg-white/5';
                        
                        if (isSubmitted) {
                          if (isCorrectOption) {
                            optionStyle = 'bg-green-500/10 border-green-500/50 text-green-400 font-medium';
                          } else if (isSelected && !isQuestionCorrect) {
                            optionStyle = 'bg-red-500/10 border-red-500/50 text-red-400';
                          } else {
                            optionStyle = 'bg-surface-container-lowest/30 border-white/5 text-on-surface-variant/40';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-primary/10 border-primary text-primary font-medium';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, option)}
                            className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                          >
                            <span className="text-sm" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(option) }} />
                            <div className="flex items-center">
                              {isSubmitted && isCorrectOption && (
                                <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                              )}
                              {isSubmitted && isSelected && !isQuestionCorrect && (
                                <span className="material-symbols-outlined text-red-400 text-sm">cancel</span>
                              )}
                              {!isSubmitted && (
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-white/20'}`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {isSubmitted && q.explanation && (
                      <div className="pl-9 mt-2">
                        <div className="p-3.5 rounded-lg bg-surface-container border border-white/5 flex items-start space-x-2 text-xs text-on-surface-variant leading-relaxed">
                          <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                          <div className="flex-1">
                            <strong className="text-on-background block mb-1">Explanation</strong>
                            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(q.explanation) }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Button */}
              {!isSubmitted && (
                <button
                  type="submit"
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                  className="w-full py-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all shadow-lg cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Submit Quiz Answers</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

function parseInlineMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm text-primary">$1</code>');
}
