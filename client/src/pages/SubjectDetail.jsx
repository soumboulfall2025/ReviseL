import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
      })
      .catch(() => setError('Erreur chargement matière ou cours.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subject) return <div>Matière introuvable.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2 text-green-700">{subject.name}</h2>
      {subject.description && <p className="mb-4 text-gray-600 dark:text-gray-300">{subject.description}</p>}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-violet-700">Cours</h3>
        <div className="space-y-6">
          {courses.length === 0 && <div className="text-gray-500">Aucun cours pour cette matière.</div>}
          {courses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="font-bold text-green-700 mb-1">{course.title}</div>
              <div className="text-gray-700 dark:text-gray-200 mb-2">{course.content}</div>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => navigate(`/soumission?subject=${subject._id}&course=${course._id}`)}
              >
                Faire le devoir
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-500">ID: {subject._id}</div>
    </div>
  );
};

export default SubjectDetail;
