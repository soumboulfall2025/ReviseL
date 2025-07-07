import React from 'react';

const Badge = ({ label, unlocked }) => (
  <div className={`flex items-center gap-2 px-2 md:px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-all ${unlocked ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>
    <span role="img" aria-label="badge">🏅</span>
    <span className="hidden xs:inline">{label}</span>
  </div>
);

export default Badge;
