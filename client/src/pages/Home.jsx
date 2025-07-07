import React from 'react';
import { motion } from 'framer-motion';

const Home = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-violet-100 dark:from-gray-900 dark:via-gray-800 dark:to-violet-900 transition-colors">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1 className="text-4xl md:text-6xl font-extrabold text-green-600 font-poppins mb-4">Prépare ton bac, libère ton avenir</h1>
      <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200 mb-8">L’application de révision ultime pour les candidats libres au Bac L au Sénégal.</p>
      <a href="/dashboard" className="inline-block px-8 py-4 bg-violet-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg text-lg transition-all">Commencer à réviser</a>
    </motion.div>
  </main>
);

export default Home;
