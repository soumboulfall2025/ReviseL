import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-lg w-full border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-700 dark:text-green-400 mb-2 text-center font-poppins tracking-tight">
          Bienvenue sur l’interface <span className="text-green-600 dark:text-violet-400">Admin ReviseL</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg mb-2">
          Gérez les utilisateurs, matières, statistiques et contenus de la plateforme de révision du bac L Sénégal.
        </p>
        <Link to="/admin" className="inline-block px-6 py-3 bg-violet-600 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-all text-lg">
          Accéder au panel admin
        </Link>
        <div className="flex gap-2 mt-4">
          <span className="text-xs text-gray-400">ReviseL &copy; 2025</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
