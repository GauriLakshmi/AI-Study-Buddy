import { useState } from 'react';
import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import Dashboard from './components/Dashboard';
import ResearchAssistant from './components/ResearchAssistant';
import QuizGenerator from './components/QuizGenerator';
import FlashcardsDashboard from './components/FlashcardsDashboard';

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
          <FlashcardsDashboard onViewChange={setCurrentView} />
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
