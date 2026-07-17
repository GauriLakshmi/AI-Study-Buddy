import { useState } from 'react';
import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import Dashboard from './components/Dashboard';
import ResearchAssistant from './components/ResearchAssistant';
import QuizGenerator from './components/QuizGenerator';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-background min-h-screen flex selection:bg-primary selection:text-on-primary">
      {/* Side Navigation Bar */}
      <SideNavBar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-gradient-radial">
        {/* Top Navigation Bar */}
        <TopNavBar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Dynamic Page Views */}
        {currentView === 'dashboard' && (
          <Dashboard onViewChange={setCurrentView} />
        )}

        {currentView === 'flashcards' && (
          <main className="flex-1 p-container-padding-mobile md:p-container-padding-desktop flex flex-col items-center justify-center relative overflow-hidden">
            <div className="text-center space-y-6 max-w-lg glass-level-2 glass-card-border rounded-xl p-12 bg-surface-container/80 border border-white/10 shadow-xl">
              <span className="material-symbols-outlined text-primary text-[64px] animate-bounce">school</span>
              <h2 className="font-headline-lg text-headline-lg text-on-background">Flashcards</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your flashcard review interface will be integrated here.
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        )}

        {currentView === 'research' && (
          <ResearchAssistant />
        )}

        {currentView === 'quiz' && (
          <QuizGenerator />
        )}
      </div>
    </div>
  );
}
