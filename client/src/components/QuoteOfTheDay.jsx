import React from 'react';

const QuoteOfTheDay = ({ quote, author }) => (
  <div className="w-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 rounded-lg px-2 sm:px-4 py-2 sm:py-3 mb-4 flex items-center gap-2 sm:gap-3 shadow-sm animate-fade-in text-xs sm:text-base">
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17h6M9 13h6M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"/></svg>
    <div>
      <span className="italic">"{quote}"</span>
      <span className="block text-xs text-violet-500 mt-1">— {author}</span>
    </div>
  </div>
);

export default QuoteOfTheDay;
