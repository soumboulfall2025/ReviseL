import React, { useState } from 'react';
import { motion } from 'framer-motion';

const initialFeedback = {
  note: null,
  comment: '',
  axes: [],
};

const fadeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API_URL = import.meta.env.VITE_API_URL;

const SubmissionPage = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState(initialFeedback);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('Philosophie');

  const handleCorrection = async () => {
    setLoading(true);
    setFeedback(initialFeedback);
    try {
      const res = await fetch(`${API_URL}/api/ia/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur IA');
      // Extraction simple : note, commentaire, axes
      const match = data.feedback.match(/note\s*:\s*(\d{1,2})/i);
      const note = match ? parseInt(match[1]) : null;
      const axes = [];
      const axesMatch = data.feedback.match(/axes d'amélioration\s*:\s*([\s\S]*)/i);
      if (axesMatch) {
        axesMatch[1].split(/\n|\r/).forEach(l => { if (l.trim()) axes.push(l.replace(/^[-*•]\s*/, '')); });
      }
      setFeedback({
        note,
        comment: data.feedback,
        axes
      });
      // Enregistrement de la soumission dans la base
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/api/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            subject, // nom ou id selon ce que vous stockez côté backend
            content: text,
            note,
            feedback: data.feedback
          })
        });
      }
    } catch (err) {
      setFeedback({ note: null, comment: err.message, axes: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-2 sm:px-4 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
    >
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-2">Soumets ton devoir</h2>
        <textarea
          className="w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none shadow text-sm sm:text-base"
          placeholder="Colle ou écris ton devoir ici..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <select
          className="mb-2 p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        >
          <option>Philosophie</option>
          <option>Littérature</option>
          <option>Anglais</option>
          <option>Espagnol</option>
          <option>Histoire-Géo</option>
          <option>Autre</option>
        </select>
        <motion.button
          onClick={handleCorrection}
          disabled={loading || !text}
          className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-violet-500 hover:bg-green-600 text-white font-bold rounded-full shadow transition-all disabled:opacity-50 text-sm sm:text-base"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Correction en cours...' : 'Corriger avec l’IA'}
        </motion.button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-6 flex flex-col gap-2 sm:gap-4"
      >
        <h3 className="text-base sm:text-lg font-semibold text-violet-700 mb-2">Résultat IA</h3>
        {feedback.note !== null ? (
          <>
            <motion.div className="text-2xl sm:text-3xl font-bold text-green-600" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>{feedback.note}/20</motion.div>
            <div className="text-gray-700 dark:text-gray-200 mb-2 text-sm sm:text-base">{feedback.comment}</div>
            <ul className="list-disc ml-4 sm:ml-6 text-gray-600 dark:text-gray-300 text-xs sm:text-base">
              {feedback.axes.map((a, i) => <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>{a}</motion.li>)}
            </ul>
          </>
        ) : (
          <div className="text-gray-400 italic text-xs sm:text-base">L’analyse IA s’affichera ici après soumission.</div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubmissionPage;
