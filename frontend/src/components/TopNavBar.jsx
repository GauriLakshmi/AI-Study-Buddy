import React from 'react';

export default function TopNavBar({ onMenuClick }) {
  return (
    <header className="sticky top-0 w-full z-30 bg-background/60 backdrop-blur-md border-b border-white/5 shadow-sm flex justify-between items-center h-16 px-6 md:px-container-padding-desktop">
      <div className="flex items-center space-x-6">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg p-2 transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden md:flex items-center space-x-4">
          {/* Optional breadcrumbs or search */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-label-md text-label-md font-semibold hover:bg-primary/20 transition-all duration-300 border border-primary/20 cursor-pointer">
          Upgrade
        </button>
        <button className="text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg p-2 transition-all duration-300 flex items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg p-2 transition-all duration-300 flex items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
