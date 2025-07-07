import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/authContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      localStorage.setItem('token', data.token);
      login(data.token, data.user); // on stocke aussi les infos user
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Connexion</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-violet-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <div className="text-sm text-gray-500 mt-2 text-center">
          Pas encore de compte ? <a href="/register" className="text-violet-500 hover:underline">Inscription</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
