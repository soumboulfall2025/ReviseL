import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/subjects/${id}`).then(res => res.json()),
      fetch(`${API_URL}/api/subjects/${id}/courses`).then(res => res.json())
    ])
      .then(([subjectData, coursesData]) => {
        setSubject(subjectData);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        toast.success('Matière chargée !');
      })
      .catch(() => {
        setError('Erreur chargement matière ou cours.');
        toast.error('Erreur lors du chargement.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fonction d'affichage robuste et "cartée" pour content
  function renderContent(content) {
    if (typeof content === 'string') {
      return <span>{content}</span>;
    }
    if (typeof content === 'object' && content !== null) {
      return (
        <div className="grid gap-3">
          {Object.entries(content).map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-50 dark:bg-gray-900 rounded p-3 border border-gray-200 dark:border-gray-700 shadow transition-transform duration-300 hover:scale-105"
              style={{ animation: 'fadeIn 0.5s' }}
            >
              <div className="font-semibold text-violet-700 mb-1 animate-pulse">{key.replace(/_/g, ' ')} :</div>
              {Array.isArray(value)
                ? <ul className="list-disc list-inside ml-4">{value.map((v, i) => <li key={i}>{v}</li>)}</ul>
                : typeof value === 'object'
                  ? renderContent(value)
                  : <span>{String(value)}</span>
              }
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subject) return <div>Matière introuvable.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mt-4 mb-6">
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white font-bold shadow-md hover:bg-green-600 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Retour
        </button>
      </div>
      <h2 className="text-2xl font-extrabold mb-4 text-violet-800">{subject.name}</h2>
      <div className="mt-4 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-violet-700">Cours</h3>
        <div className="space-y-6">
          {courses.length === 0 && <div className="text-gray-500">Aucun cours pour cette matière.</div>}
          {courses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="font-bold text-green-700 mb-1">{course.title}</div>
              <div className="text-gray-700 dark:text-gray-200 mb-2">{renderContent(course.content ?? '')}</div>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => navigate(`/soumission?subject=${subject._id}&course=${course._id}`)}
              >
                Faire le devoir
              </button>
              {/* Affichage du quiz s'il existe */}
              {course.quiz && Array.isArray(course.quiz) && course.quiz.length > 0 && (
                <div className="mt-4">
                  <div className="font-semibold text-violet-700 mb-2">Quiz</div>
                  <div className="space-y-3">
                    {course.quiz.map((q, idx) => (
                      <div key={idx} className="bg-violet-50 dark:bg-violet-900 rounded p-3 border border-violet-200 dark:border-violet-700 shadow-sm">
                        <div className="font-medium text-violet-800 mb-1">Q{idx + 1}. {q.question}</div>
                        {q.choices && Array.isArray(q.choices) && (
                          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                            {q.choices.map((choice, i) => (
                              <li key={i}>{choice}</li>
                            ))}
                          </ul>
                        )}
                        {q.explanation && (
                          <div className="mt-2 text-xs text-gray-500 italic">Explication : {q.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-3 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition font-bold shadow"
                    onClick={() => navigate(`/quiz?subject=${subject._id}&course=${course._id}`)}
                  >
                    Faire le quiz
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-500">ID: {subject._id}</div>
    </div>
  );
};

export default SubjectDetail;
