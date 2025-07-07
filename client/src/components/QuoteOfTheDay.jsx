import React, { useState } from 'react';
import { HiOutlineClipboard, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const QuoteOfTheDay = ({ quote, author }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote}" — ${author}`);
      setCopied(true);
      toast.success('Citation copiée !');
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <section
      className="w-full bg-gradient-to-r from-violet-200 via-violet-100 to-fuchsia-100 dark:from-violet-900 dark:via-violet-800 dark:to-fuchsia-900 text-violet-700 dark:text-violet-200 rounded-xl px-3 sm:px-6 py-3 sm:py-5 mb-5 flex items-center gap-3 sm:gap-5 shadow-lg animate-fade-in relative overflow-hidden"
      aria-labelledby="quote-title"
      role="region"
    >
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17h6M9 13h6M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"/></svg>
      <div className="flex-1 min-w-0">
        <span id="quote-title" className="italic font-medium block text-base sm:text-lg" aria-live="polite">"{quote}"</span>
        <span className="block text-xs text-violet-500 mt-1">— {author}</span>
      </div>
      <button
        aria-label={copied ? 'Citation copiée dans le presse-papier' : 'Copier la citation dans le presse-papier'}
        onClick={handleCopy}
        className={`ml-2 p-2 rounded-full transition bg-violet-200 dark:bg-violet-800 hover:bg-violet-300 dark:hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 ${copied ? 'scale-110 bg-green-200 dark:bg-green-800' : ''}`}
        tabIndex={0}
        type="button"
      >
        {copied ? <HiCheck className="w-5 h-5 text-green-600" aria-hidden="true" /> : <HiOutlineClipboard className="w-5 h-5" aria-hidden="true" />}
        <span className="sr-only">{copied ? 'Citation copiée' : 'Copier la citation'}</span>
      </button>
    </section>
  );
};

export default QuoteOfTheDay;
