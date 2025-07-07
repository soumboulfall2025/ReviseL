import React from 'react';
import SubjectsList from '../components/SubjectsList';

const SubjectsPage = () => (
  <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
    <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 sm:mb-6">Choisis une matière à réviser</h2>
    <SubjectsList />
  </div>
);

export default SubjectsPage;
