import React from 'react';

const SkeletonCard = () => (
  <div className="rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center gap-2 animate-pulse bg-gray-200 dark:bg-gray-700 min-h-[100px]">
    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mb-2" />
    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
    <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
  </div>
);

const SkeletonList = ({ count = 6 }) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonList;
