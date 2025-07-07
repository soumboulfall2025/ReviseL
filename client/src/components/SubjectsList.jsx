import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import SkeletonList from './SkeletonList';
import toast from 'react-hot-toast';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, type: 'spring', stiffness: 120 },
  }),
};

const API_URL = import.meta.env.VITE_API_URL;

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/subjects`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Erreur inconnue');
        }
        return res.json();
      })
      .then((data) => {
        setSubjects(data);
        toast.success('Matières chargées !');
      })
      .catch((e) => {
        setError(e.message || 'Erreur chargement matières.');
        toast.error('Erreur lors du chargement.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonList />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(subjects)) return <div className="text-red-500">Erreur de chargement des matières.</div>;

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      {subjects.map((subject, i) => (
        <Link to={`/matieres/${subject._id}`} key={subject._id} className="block">
          <motion.div
            className="rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center gap-1 sm:gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
            style={{ background: subject.color || '#f3f4f6' }}
            initial="hidden"
            animate="visible"
            custom={i}
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
            <span className="text-3xl sm:text-4xl">📚</span>
            <span className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">{subject.name}</span>
            {subject.description && (
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center line-clamp-2">{subject.description}</span>
            )}
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default SubjectsList;
