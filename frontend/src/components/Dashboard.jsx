import React from 'react';

export default function Dashboard({ onViewChange }) {
  return (
    <main className="flex-1 p-container-padding-mobile md:p-container-padding-desktop flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-12 relative z-10">
        
        {/* Hero Section */}
        <div className="space-y-4 relative w-full">
          {/* Decorative subtle glow behind text */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-primary/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>
          
          <div className="flex justify-center mb-6 relative z-10">
            <span 
              className="material-symbols-outlined text-primary animate-pulse" 
              style={{ fontSize: '96px' }}
            >
              school
            </span>
          </div>
          
          <h2 className="relative z-10 font-headline-xl text-headline-xl text-on-background tracking-tight">
            Welcome! <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-tertiary-container">Study Buddy</span>
          </h2>
          <p className="relative z-10 font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Let's optimize your study sessions today.
          </p>
        </div>

        {/* Action Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full mt-12">
          
          {/* Card 1: Flashcards */}
          <div 
            onClick={() => onViewChange('flashcards')}
            className="glass-level-2 glass-card-border rounded-xl p-8 flex flex-col items-start text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 ai-glow group backdrop-blur-xl bg-surface-container/80 shadow-xl border border-white/10 hover:border-white/20"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">
                style
              </span>
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-2">
              Start FlashCards
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-1">
              Review your generated decks and reinforce your memory with spaced repetition.
            </p>
            <button className="flex items-center space-x-2 text-primary font-label-md text-label-md group-hover:text-tertiary-container transition-colors cursor-pointer">
              <span>Begin Review</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Card 2: Research Assistant */}
          <div 
            onClick={() => onViewChange('research')}
            className="glass-level-2 glass-card-border rounded-xl p-8 flex flex-col items-start text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 ai-glow group backdrop-blur-xl bg-surface-container/80 shadow-xl border border-white/10 hover:border-white/20"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">
                psychology
              </span>
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-2">
              Research Assistant
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-1">
              Ask complex questions, synthesize documents, and generate study guides instantly.
            </p>
            <button className="flex items-center space-x-2 text-primary font-label-md text-label-md group-hover:text-tertiary-container transition-colors cursor-pointer">
              <span>Open Assistant</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
}
