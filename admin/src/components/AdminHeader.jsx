import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const isAdmin = user && JSON.parse(user).role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800 relative">
      <Link to="/" className="text-2xl font-bold text-violet-700 dark:text-green-400 font-poppins tracking-tight">ReviseL Admin</Link>
      {/* Menu desktop */}
      <nav className="hidden md:flex gap-4 items-center">
        <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-violet-400 font-semibold">Utilisateurs</Link>
        <Link to="/subjects" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-violet-400 font-semibold">Matières</Link>
        {isAdmin && (
          <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-full font-bold transition">Déconnexion</button>
        )}
      </nav>
      {/* Hamburger mobile */}
      <button className="md:hidden p-2 rounded bg-gray-100 dark:bg-gray-800 ml-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">
        {menuOpen ? <XMarkIcon className="w-7 h-7 text-violet-700 dark:text-green-400" /> : <Bars3Icon className="w-7 h-7 text-violet-700 dark:text-green-400" />}
      </button>
      {/* Menu mobile */}
      {menuOpen && (
        <nav className="absolute top-full right-0 left-0 bg-white dark:bg-gray-900 shadow-md flex flex-col items-center gap-4 py-4 z-50 md:hidden animate-fade-in border-b border-gray-100 dark:border-gray-800">
          <Link to="/admin" className="hover:text-green-600 dark:hover:text-violet-400 font-semibold" onClick={() => setMenuOpen(false)}>Utilisateurs</Link>
          <Link to="/subjects" className="hover:text-green-600 dark:hover:text-violet-400 font-semibold" onClick={() => setMenuOpen(false)}>Matières</Link>
          {isAdmin && (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-full font-bold transition">Déconnexion</button>
          )}
        </nav>
      )}
    </header>
  );
};

export default AdminHeader;
