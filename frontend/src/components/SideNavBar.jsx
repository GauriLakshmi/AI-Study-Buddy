import React from 'react';

export default function SideNavBar({ currentView, onViewChange, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'flashcards', label: 'Flashcards', icon: 'school' },
    { id: 'research', label: 'Research AI', icon: 'psychology' },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-35 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`h-screen w-64 fixed left-0 top-0 bg-surface-container/80 backdrop-blur-xl border-r border-white/10 shadow-xl flex flex-col py-8 px-4 z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
        <div className="mb-12 px-2 flex items-center space-x-3">
          <span className="material-symbols-outlined text-primary text-[32px]">school</span>
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">StudyBuddy</h1>
            <p className="font-label-sm text-label-sm text-primary/70">Your research partner</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (setIsOpen) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all active:scale-95 duration-200 text-left ${
                  isActive
                    ? 'text-primary font-bold border-r-2 border-primary bg-primary/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                }`}
              >
                <span 
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-2">
          {/* Bottom space if needed */}
        </div>
      </nav>
    </>
  );
}
