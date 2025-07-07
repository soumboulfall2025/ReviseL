import React from 'react';

const Sidebar = () => (
  <aside className="hidden md:flex fixed left-0 top-0 h-full w-16 bg-green-50 dark:bg-gray-800 flex-col items-center py-6 shadow-lg z-30">
    <nav className="flex flex-col gap-8 mt-8">
      {/* Icônes de navigation (à remplacer par des SVG ou Heroicons) */}
      <a href="/" title="Accueil" className="group">
        <svg className="w-7 h-7 text-green-600 group-hover:text-violet-500 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg>
      </a>
      <a href="/dashboard" title="Dashboard" className="group">
        <svg className="w-7 h-7 text-violet-500 group-hover:text-green-600 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1"/></svg>
      </a>
      <a href="/matieres" title="Matières" className="group">
        <svg className="w-7 h-7 text-gray-400 group-hover:text-green-600 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 12h16"/></svg>
      </a>
      <a href="/soumission" title="Soumettre un devoir" className="group">
        <svg className="w-7 h-7 text-gray-400 group-hover:text-green-600 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
      </a>
    </nav>
  </aside>
);

export default Sidebar;
