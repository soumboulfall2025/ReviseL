import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '../components/ProgressBar';
import QuoteOfTheDay from '../components/QuoteOfTheDay';
import Badge from '../components/Badge';
import { useAuth } from '../features/authContext.jsx';

const fadeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/progress/me`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Erreur inconnue');
        }
        return res.json();
      })
      .then(data => setSubmissions(data))
      .catch(e => setError(e.message || 'Erreur chargement progression.'))
      .finally(() => setLoading(false));
  }, [user]);

  // Calculs dynamiques
  const progress = submissions.length ? Math.round((submissions.filter(s => s.note >= 10).length / submissions.length) * 100) : 0;
  const lastNotes = submissions.slice(-3).reverse().map(s => ({ subject: s.subject?.name, note: s.note }));
  // Badges fictifs (à améliorer)
  const badges = [
    { label: 'Débutant', unlocked: submissions.length >= 1 },
    { label: 'Assidu', unlocked: submissions.length >= 5 },
    { label: 'Expert', unlocked: submissions.length >= 10 },
  ];

  const quote = {
    quote: "Le succès, c’est se promener d’échec en échec tout en restant motivé.",
    author: 'Winston Churchill',
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8"
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
    >
      <QuoteOfTheDay quote={quote.quote} author={quote.author} />
      <motion.h2 className="text-xl sm:text-2xl font-bold mb-2 text-green-700" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        Ta progression
      </motion.h2>
      <ProgressBar progress={progress} />
      <div className="mt-4 sm:mt-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Dernières notes</h3>
        <ul className="flex flex-wrap gap-2 sm:gap-4">
          {lastNotes.map((n, i) => (
            <motion.li
              key={n.subject + i}
              className="bg-white dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow text-center w-28 sm:w-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="block text-xs sm:text-sm text-gray-500">{n.subject}</span>
              <span className="text-lg sm:text-xl font-bold text-green-600">{n.note}/20</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3 flex-wrap">
        {badges.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Badge label={b.label} unlocked={b.unlocked} />
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-6 sm:mt-8 p-3 sm:p-4 bg-violet-50 dark:bg-violet-900 rounded-lg shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h4 className="font-semibold text-violet-700 dark:text-violet-200 mb-2 text-sm sm:text-base">Conseil de l’IA</h4>
        <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-base">Relis tes copies corrigées et concentre-toi sur les axes d’amélioration proposés !</p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
