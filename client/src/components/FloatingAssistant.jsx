import React from 'react';

const FloatingAssistant = () => (
  <div className="fixed bottom-4 right-4 z-50">
    <button className="bg-violet-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all animate-bounce text-base md:text-lg">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 12h16"/></svg>
      <span className="hidden sm:inline font-semibold">Assistant IA</span>
    </button>
  </div>
);

export default FloatingAssistant;
