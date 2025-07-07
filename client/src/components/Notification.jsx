import React from 'react';

const Notification = ({ message }) => (
  <div className="fixed top-4 right-2 sm:top-6 sm:right-6 bg-white dark:bg-gray-900 border border-green-200 dark:border-violet-400 shadow-lg px-4 sm:px-6 py-2 sm:py-3 rounded-lg z-50 animate-fade-in text-sm sm:text-base">
    <span className="text-green-600 font-semibold">{message}</span>
  </div>
);

export default Notification;
