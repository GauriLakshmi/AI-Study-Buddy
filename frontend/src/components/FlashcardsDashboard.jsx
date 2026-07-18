import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const DEFAULT_USER_ID = '60d5ecb8b51d482c3c9c9f8a';

export default function FlashcardsDashboard({ onViewChange }) {
  // Collections and cards state
  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Form inputs & loading states
  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // New deck creation state
  const [showNewDeckInput, setShowNewDeckInput] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  // Daily statistics state
  const [studiedToday, setStudiedToday] = useState(0);

  const fileInputRef = useRef(null);

  // Load decks on mount
  useEffect(() => {
    fetchDecks();
    loadStudiedTodayCount();
  }, []);

  // Fetch cards when active deck changes
  useEffect(() => {
    if (selectedDeckId) {
      fetchFlashcards(selectedDeckId);
    } else {
      setFlashcards([]);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [selectedDeckId]);

  const fetchDecks = async () => {
    try {
      const data = await api.getDecks(DEFAULT_USER_ID);
      setDecks(data);
      if (data.length > 0 && !selectedDeckId) {
        // Default to the first deck
        setSelectedDeckId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch decks:', err);
      setError('Could not load decks.');
    }
  };

  const fetchFlashcards = async (deckId) => {
    try {
      const data = await api.getFlashcards(deckId);
      setFlashcards(data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error('Failed to fetch flashcards:', err);
      setError('Could not load flashcards for selected deck.');
    }
  };

  const loadStudiedTodayCount = () => {
    const todayKey = `studied_today_${new Date().toDateString()}`;
    const count = parseInt(localStorage.getItem(todayKey) || '0', 10);
    setStudiedToday(count);
  };

  // Generate flashcards from topic
  const handleGenerateCards = async (e) => {
    if (e) e.preventDefault();
    if (!topicInput || !topicInput.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Generate cards using backend API
      const response = await api.generateFlashcards({
        topic: topicInput.trim(),
        userId: DEFAULT_USER_ID,
        deckId: null, // Creates a new deck
        numCards: 10
      });

      if (response.success) {
        setTopicInput('');
        // Re-fetch all decks
        const updatedDecks = await api.getDecks(DEFAULT_USER_ID);
        setDecks(updatedDecks);
        // Select the newly created deck
        setSelectedDeckId(response.deckId);
        setFlashcards(response.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Flashcards generation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate flashcards.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF Upload mock/trigger
  const handlePDFUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Clean up filename to use as topic
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

    try {
      // Mock parsing process briefly
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.generateFlashcards({
        topic: baseName,
        userId: DEFAULT_USER_ID,
        deckId: null,
        numCards: 10
      });

      if (response.success) {
        const updatedDecks = await api.getDecks(DEFAULT_USER_ID);
        setDecks(updatedDecks);
        setSelectedDeckId(response.deckId);
        setFlashcards(response.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        throw new Error('Upload generation failed');
      }
    } catch (err) {
      console.error('File generation error:', err);
      setError('Failed to extract data and generate flashcards from PDF.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Create new deck manually
  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    try {
      const newDeck = await api.createDeck({
        name: newDeckName.trim(),
        userId: DEFAULT_USER_ID
      });
      setDecks((prev) => [...prev, newDeck]);
      setSelectedDeckId(newDeck._id);
      setNewDeckName('');
      setShowNewDeckInput(false);
    } catch (err) {
      console.error('Failed to create deck:', err);
      setError('Could not create new deck.');
    }
  };

  // Delete deck
  const handleDeleteDeck = async (deckId, e) => {
    e.stopPropagation(); // Prevent select deck
    if (!window.confirm('Are you sure you want to delete this collection?')) return;

    try {
      await api.deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d._id !== deckId));
      if (selectedDeckId === deckId) {
        setSelectedDeckId(null);
      }
    } catch (err) {
      console.error('Failed to delete deck:', err);
      setError('Could not delete deck.');
    }
  };

  // Toggle Bookmark status of active card
  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    if (!flashcards.length) return;

    const card = flashcards[currentIndex];
    const nextBookmarked = !card.bookmarked;

    try {
      const updatedCard = await api.updateFlashcard(card._id, { bookmarked: nextBookmarked });
      setFlashcards((prev) =>
        prev.map((c, i) => (i === currentIndex ? updatedCard : c))
      );
    } catch (err) {
      console.error('Failed to update bookmark:', err);
    }
  };

  // Rate card difficulty
  const handleRateCard = async (rating) => {
    if (!flashcards.length) return;

    const card = flashcards[currentIndex];
    try {
      const updatedCard = await api.updateFlashcard(card._id, { difficulty: rating });
      setFlashcards((prev) =>
        prev.map((c, i) => (i === currentIndex ? { ...c, difficulty: rating } : c))
      );

      // Increment studied count
      const todayKey = `studied_today_${new Date().toDateString()}`;
      const count = parseInt(localStorage.getItem(todayKey) || '0', 10) + 1;
      localStorage.setItem(todayKey, count.toString());
      setStudiedToday(count);

      // Slide to next card
      setTimeout(() => {
        setIsFlipped(false);
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex(0);
        }
      }, 400);
    } catch (err) {
      console.error('Failed to rate card:', err);
    }
  };

  // Card navigation helpers
  const handlePrevCard = () => {
    if (!flashcards.length) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleNextCard = () => {
    if (!flashcards.length) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  // Calculated Stats
  const activeDeck = decks.find((d) => d._id === selectedDeckId);
  const totalCardsCount = flashcards.length;

  const studiedCards = flashcards.filter((c) => c.difficulty && c.difficulty !== 'Unstudied');
  const correctCount = studiedCards.filter((c) => c.difficulty === 'Good' || c.difficulty === 'Easy').length;
  const averageAccuracy = studiedCards.length ? Math.round((correctCount / studiedCards.length) * 100) : 88;

  // AI suggestion dynamic trigger based on Hard cards
  const hardCards = flashcards.filter((c) => c.difficulty === 'Hard');
  const suggestionTopic = hardCards.length > 0 
    ? hardCards[0].question.split(' ').slice(0, 3).join(' ') 
    : (activeDeck ? activeDeck.name : "Quantum Decoherence");

  const handleTriggerAISuggestion = () => {
    setTopicInput(`${suggestionTopic} deep dive`);
    // Focus or scroll to input
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determinisitc mapping of images for Recent Collections
  const collectionImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDYgpSVHm6gyEoOCrni4TJ4DknjFSip9f8C9zJN0c_GDNXfH_DoxJUV_lIciGmDhZoZgSZe6NDVOZPWTECUfFHvBVZ8-cDyYpNVrDeAxVYuZlXTLYLs-cOSRotcSgxF5E6GlfJHh04oSupvMzRhiwH8sAMWGPcByKAPSLXae7nvZAP0skAY1sgjTA2R0NnCvuolYgsNrBKCKwmcIiawoRu7uwqmZRfTY2MI0TN_6UFqtz45HMFkLWoZTwzEGYK8Z4dwC-IZ2d1SJg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBvz4PtKiNFzFSY0Kr1CYa6X85tqX5pUeEjTG_J7JRrXr0ndZSJCpkeGaioEHbHxHXwLdqGT6ltvMKzZMlHaVMU6k0DefbFMDHW8iKzT-7DskWrLPIlYHYHVwhaV3e4XLw__whN7XMauVPj0SMKYJZ7wVvs603mXYqDqbM3nQNQ_--zah59tOc-dhY1HSFeE3O4MFbFcfAScBduPABt8HsDE4EGLlptfQ5pg-zhMxY05dUgm0Xckf8kxzcI61ViMIFPrLdR04wMog',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCoULy_jRtPzltB76Rswmr4hwq67SGAp2mFMqg_ZaIusflv2yKWScmwU1GasbR2BjQuv29MJH-gg1nMX5lByjHBni8f376A3InlyQsqB5c_MH2upw5UwvW3LYHFcsli4AHv95uOWT2h1NS_OuOc50Z_hk16q5_mDJOWRKvl3tBXLusRpD_RE7y9_P9-o6-v8S4xZhPWlpXjeqqgZyS7Q55Ld20rWCkwcU5SeYs89gYYUiJ9RaYVYls7r4gRHsLUBEMUty6zcSEXJA'
  ];

  return (
    <main className="p-6 md:p-12 min-h-screen relative flex-1">
      {/* Hidden input for PDF upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt"
        className="hidden"
      />

      {/* Atmospheric Background Light Leak */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Flashcards</h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            <p className="font-body-md text-body-md">Generate and revise flashcards using AI intelligence.</p>
          </div>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              <p className="font-label-md">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {/* Top Controls Bar */}
        <section className="glass-level-2 p-4 rounded-2xl flex flex-wrap md:flex-nowrap items-center gap-4 mb-12 ai-glow border border-white/10 bg-surface-container/60 shadow-xl">
          <button 
            onClick={handlePDFUploadClick}
            disabled={isUploading || isGenerating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-label-md font-label-md shrink-0 text-on-surface cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              {isUploading ? 'sync' : 'upload_file'}
            </span>
            {isUploading ? 'Reading PDF...' : 'Upload PDF'}
          </button>
          
          <div className="relative flex-grow">
            <input 
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              disabled={isGenerating || isUploading}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCards()}
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-label-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface placeholder:text-on-surface-variant/40 transition-all" 
              placeholder="Enter a topic (e.g., Quantum Mechanics)" 
              type="text" 
            />
          </div>

          <button 
            onClick={() => handleGenerateCards()}
            disabled={isGenerating || isUploading || !topicInput.trim()}
            className="flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Flashcard'}
          </button>
        </section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Center Study Area */}
          <div className="lg:col-span-8 flex flex-col items-center gap-8">
            
            {/* Interactive Flashcard */}
            {totalCardsCount > 0 ? (
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full aspect-[16/10] glass-level-2 rounded-[32px] p-12 flex flex-col items-center justify-center text-center relative group cursor-pointer transition-all duration-500 hover:border-primary/30 border border-white/10 bg-surface-container/60 shadow-2xl" 
                id="flashcard"
              >
                {/* Card Indicator */}
                <div className="absolute top-8 left-12 px-3 py-1 bg-surface-container-high border border-white/5 rounded-full">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Card {currentIndex + 1} / {totalCardsCount}
                  </span>
                </div>
                
                <div className="absolute top-8 right-12">
                  <button 
                    onClick={handleToggleBookmark}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span 
                      className={`material-symbols-outlined text-2xl ${flashcards[currentIndex].bookmarked ? 'text-primary' : ''}`}
                      style={flashcards[currentIndex].bookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  
                  {/* Question View */}
                  {!isFlipped ? (
                    <div className="space-y-6 w-full animate-in fade-in zoom-in-95 duration-300" id="question-view">
                      <h3 className="font-headline-lg text-headline-lg text-on-surface max-w-2xl mx-auto">
                        {flashcards[currentIndex].question}
                      </h3>
                      <div className="pt-8">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(true);
                          }}
                          className="px-10 py-4 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 font-label-md text-label-md flex items-center gap-3 mx-auto cursor-pointer" 
                          id="reveal-btn"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                          Reveal Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Answer View */
                    <div className="space-y-6 w-full animate-in fade-in duration-300" id="answer-view">
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md font-label-sm text-label-sm mb-4">
                        ANSWER
                      </div>
                      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
                        {flashcards[currentIndex].answer}
                      </p>
                      <div className="pt-8 flex justify-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard('Hard');
                          }}
                          className={`px-6 py-2 rounded-lg bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-all font-label-md cursor-pointer ${
                            flashcards[currentIndex].difficulty === 'Hard' ? 'ring-2 ring-error' : ''
                          }`}
                        >
                          Hard
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard('Good');
                          }}
                          className={`px-6 py-2 rounded-lg bg-surface-variant text-on-surface hover:bg-surface-bright border border-white/5 transition-all font-label-md cursor-pointer ${
                            flashcards[currentIndex].difficulty === 'Good' ? 'ring-2 ring-primary-container' : ''
                          }`}
                        >
                          Good
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard('Easy');
                          }}
                          className={`px-6 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-label-md cursor-pointer ${
                            flashcards[currentIndex].difficulty === 'Easy' ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          Easy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* No Flashcards Placeholder */
              <div className="w-full aspect-[16/10] glass-level-2 rounded-[32px] p-12 flex flex-col items-center justify-center text-center relative border border-white/10 bg-surface-container/60 shadow-2xl">
                <span className="material-symbols-outlined text-[64px] text-primary mb-4 animate-pulse">
                  school
                </span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  No Flashcards Found
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-6">
                  {selectedDeckId 
                    ? "This collection is empty. Enter a topic above to generate a new set of flashcards!" 
                    : "Create a collection or enter a topic above to start generating flashcards."
                  }
                </p>
                {selectedDeckId && (
                  <button 
                    onClick={() => {
                      setTopicInput(activeDeck ? activeDeck.name : "Quantum Mechanics");
                    }}
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md cursor-pointer"
                  >
                    Set Generation Topic
                  </button>
                )}
              </div>
            )}

            {/* Navigation Controls */}
            {totalCardsCount > 0 && (
              <div className="flex items-center gap-12">
                <button 
                  onClick={handlePrevCard}
                  className="p-4 rounded-full glass-level-2 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all active:scale-90 border border-white/10 cursor-pointer bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[32px]">arrow_back</span>
                </button>
                <div className="h-1 w-48 bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full shimmer-progress rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalCardsCount) * 100}%` }}
                  ></div>
                </div>
                <button 
                  onClick={handleNextCard}
                  className="p-4 rounded-full glass-level-2 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all active:scale-90 border border-white/10 cursor-pointer bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[32px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Statistics */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Study Insights Card */}
            <div className="glass-level-2 p-8 rounded-[24px] border border-white/10 bg-surface-container/60 shadow-xl">
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-6 flex items-center justify-between">
                Study Insights
                <span className="material-symbols-outlined text-[18px]">insights</span>
              </h4>
              <div className="space-y-8">
                
                {/* Stat 1: Generated */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">stacks</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Generated</p>
                      <p className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
                        {totalCardsCount}
                      </p>
                    </div>
                  </div>
                  <span className="text-primary text-label-sm">Active Deck</span>
                </div>
                
                {/* Stat 2: Studied Today */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined">event_available</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Studied Today</p>
                      <p className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
                        {studiedToday}
                      </p>
                    </div>
                  </div>
                  <span className="text-on-surface-variant text-label-sm">Daily Goal: 50</span>
                </div>
                
                {/* Accuracy Progress */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-end mb-3">
                    <p className="font-label-md text-label-md text-on-surface">Average Accuracy</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile font-black text-primary">
                      {averageAccuracy}%
                    </p>
                  </div>
                  <div className="w-full h-3 bg-surface-container-lowest rounded-full p-0.5 border border-white/5">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${averageAccuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="glass-level-2 p-6 rounded-[24px] border border-primary/20 bg-primary/5 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lightbulb
                </span>
                <div>
                  <h5 className="font-label-md text-label-md font-bold mb-2 text-on-surface">AI Suggestion</h5>
                  <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                    {hardCards.length > 0 
                      ? `You're struggling with "${suggestionTopic}". Would you like to generate 5 deep-dive cards for this topic?`
                      : "You're doing great! To deepen your knowledge, you can generate a set of deep-dive cards on active topics."
                    }
                  </p>
                  <button 
                    onClick={handleTriggerAISuggestion}
                    className="mt-4 text-primary font-label-sm text-label-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                  >
                    Learn More <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Gallery of recent topics */}
        <section className="mt-20">
          <h4 className="font-headline-lg-mobile text-headline-lg-mobile mb-8 text-on-surface">
            Recent Collections
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {decks.map((deck, idx) => {
              const isSelected = deck._id === selectedDeckId;
              const imgUrl = collectionImages[idx % collectionImages.length];

              return (
                <div 
                  key={deck._id}
                  onClick={() => setSelectedDeckId(deck._id)}
                  className={`glass-level-2 p-6 rounded-2xl group hover:scale-[1.02] transition-all cursor-pointer border relative ${
                    isSelected ? 'border-primary/50 bg-primary/5 shadow-primary/5 shadow-md' : 'border-white/10'
                  }`}
                >
                  {/* Delete deck button */}
                  <button
                    onClick={(e) => handleDeleteDeck(deck._id, e)}
                    className="absolute top-4 right-4 bg-surface-container-high/80 text-on-surface-variant hover:text-error hover:bg-white/10 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                    title="Delete collection"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>

                  <div className="w-full aspect-video rounded-xl mb-4 bg-surface-container-lowest overflow-hidden">
                    <div 
                      className="w-full h-full opacity-40 group-hover:opacity-60 transition-opacity bg-cover bg-center"
                      style={{ backgroundImage: `url('${imgUrl}')` }}
                    ></div>
                  </div>
                  <h6 className="font-label-md text-label-md font-bold mb-1 text-on-surface truncate">
                    {deck.name}
                  </h6>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {isSelected ? totalCardsCount : 'Select to view'} Cards
                  </p>
                </div>
              );
            })}

            {/* New Set / Create Collection Form */}
            {showNewDeckInput ? (
              <form 
                onSubmit={handleCreateDeck}
                className="glass-level-2 p-6 rounded-2xl border border-dashed border-primary/50 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <h6 className="font-label-md text-label-md font-bold text-primary">New Collection</h6>
                  <input
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="Enter name..."
                    autoFocus
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-3 py-2 text-label-sm focus:border-primary outline-none text-on-surface animate-in fade-in duration-300"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm font-semibold cursor-pointer"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewDeckInput(false);
                      setNewDeckName('');
                    }}
                    className="flex-1 py-2 bg-surface-variant text-on-surface rounded-lg font-label-sm text-label-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div 
                onClick={() => setShowNewDeckInput(true)}
                className="glass-level-2 p-6 rounded-2xl group hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center justify-center border-dashed border-2 border-white/10 hover:border-primary/50 min-h-[170px]"
              >
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-2 group-hover:text-primary transition-colors">
                  add_circle
                </span>
                <p className="font-label-md text-label-md font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">
                  New Set
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
