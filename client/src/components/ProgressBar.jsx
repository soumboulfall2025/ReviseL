import React from 'react';

const ProgressBar = ({ progress = 0 }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4 mt-4">
    <div
      className="bg-green-500 h-3 md:h-4 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export default ProgressBar;
