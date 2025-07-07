import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../features/authContext.jsx';

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const Header = () => {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth ? useAuth() : { user: null, logout: () => {} };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-40">
      <div className="flex items-center gap-2">
        {/* Logo Vite supprimé */}
        <motion.span
          className="text-2xl font-bold text-green-600 font-poppins"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          ReviseL
        </motion.span>
      </div>
      <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200">
        <a href="/" className="hover:text-green-600 transition">Accueil</a>
        <a href="/dashboard" className="hover:text-green-600 transition">Dashboard</a>
        <a href="/matieres" className="hover:text-green-600 transition">Matières</a>
        <a href="/soumission" className="hover:text-green-600 transition">Soumettre un devoir</a>
      </nav>
      <div className="flex items-center gap-2 relative">
        {/* Icônes profil et déconnexion toujours visibles */}
        {user && (
          <>
            <button
              aria-label="Profil utilisateur"
              className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-violet-700 transition"
              onClick={() => window.location.href = '/profil'}
            >
              <UserCircleIcon className="w-7 h-7 text-green-600" />
            </button>
            <button
              aria-label="Déconnexion"
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
              onClick={logout}
            >
              <ArrowLeftOnRectangleIcon className="w-7 h-7 text-red-500" />
            </button>
          </>
        )}
        <button
          aria-label={dark ? 'Activer le mode clair' : 'Activer le mode sombre'}
          onClick={() => setDark((d) => !d)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-violet-700 transition"
        >
          {dark ? (
            <motion.svg
              className="w-6 h-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              whileHover={{ scale: 1.2, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z"/>
            </motion.svg>
          ) : (
            <motion.svg
              className="w-6 h-6 text-violet-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              whileHover={{ scale: 1.2, rotate: -20 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
            </motion.svg>
          )}
        </button>
        <button
          className="md:hidden p-2 ml-2 rounded bg-gray-100 dark:bg-gray-800"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <motion.svg
            className="w-7 h-7 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            whileTap={{ scale: 1.2 }}
          >
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </motion.svg>
        </button>
      </div>
      {/* Menu mobile animé */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-center gap-4 py-4 md:hidden animate-fade-in z-50"
          >
            <a href="/" className="hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Accueil</a>
            <a href="/dashboard" className="hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Dashboard</a>
            <a href="/matieres" className="hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Matières</a>
            <a href="/soumission" className="hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Soumettre un devoir</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
