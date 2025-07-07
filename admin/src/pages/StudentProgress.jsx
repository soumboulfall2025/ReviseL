import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const StudentProgress = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/progress/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur chargement progression.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/admin" className="text-violet-600 hover:underline">&larr; Retour</Link>
      <h2 className="text-xl font-bold mb-4 mt-2">Évolution de l'étudiant</h2>
      {submissions.length === 0 ? (
        <div>Aucune soumission trouvée.</div>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s, i) => (
            <li key={s._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">{new Date(s.createdAt).toLocaleString()}</div>
              <div className="font-semibold">Matière : {s.subject?.name || 'N/A'}</div>
              <div className="mb-1">Note : <span className="font-bold text-green-600">{s.note ?? 'Non noté'}</span></div>
              <div className="mb-1">Feedback : <span className="italic">{s.feedback || 'Aucun'}</span></div>
              <details className="mt-2">
                <summary className="cursor-pointer text-violet-600">Voir le devoir</summary>
                <pre className="bg-white p-2 rounded text-xs mt-1 overflow-x-auto">{s.content}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentProgress;
