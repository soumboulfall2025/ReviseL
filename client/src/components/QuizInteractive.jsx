import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

function renderContent(content) {
  if (typeof content === 'string') {
    return <div className="mb-2 whitespace-pre-line">{content}</div>;
  }
  if (typeof content === 'object' && content !== null) {
    return (
      <div className="space-y-2">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold capitalize text-violet-700">{key.replace(/_/g, ' ')} : </span>
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside ml-4">
                {value.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            ) : typeof value === 'object' ? (
              renderContent(value)
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const QuizInteractive = () => {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/subjects`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Erreur chargement matières.');
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

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-2 py-8">
        <button onClick={() => setSelected(null)} className="mb-4 px-3 py-1 bg-violet-200 dark:bg-violet-800 rounded text-violet-700 dark:text-violet-200">← Retour</button>
        <h2 className="text-2xl font-bold mb-4 text-green-700">{selected.name}</h2>
        {selected.courses && selected.courses.length > 0 ? (
          <div className="space-y-6">
            {selected.courses.map((course, idx) => (
              <div key={course._id || idx} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 border-t-4" style={{ borderColor: selected.color || '#a78bfa' }}>
                <h3 className="text-lg font-bold text-violet-700 mb-2">{course.title}</h3>
                {renderContent(course.content)}
                {course.questions && Array.isArray(course.questions) && (
                  <QuizBlock questions={course.questions} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Aucun cours pour cette matière.</div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2 py-8">
      <h2 className="text-2xl font-bold mb-6 text-violet-700">Choisis une matière à réviser</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {subjects.map((s) => (
          <button
            key={s._id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 border-t-4 text-left hover:scale-105 transition-transform"
            style={{ borderColor: s.color || '#a78bfa' }}
            onClick={() => setSelected(s)}
          >
            <div className="text-xs text-gray-400 mb-1">ID: {s._id}</div>
            <div className="text-lg font-bold text-violet-700 mb-1">{s.name}</div>
            <div className="text-gray-600 dark:text-gray-300">{s.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

function QuizBlock({ questions }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [show, setShow] = useState(false);

  return (
    <div className="mt-4">
      <div className="font-semibold text-green-700 mb-1">Quiz :</div>
      <form
        onSubmit={e => {
          e.preventDefault();
          setShow(true);
        }}
        className="space-y-2"
      >
        {questions.map((q, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label className="text-sm text-violet-700">{q}</label>
            <input
              type="text"
              className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              value={answers[i]}
              onChange={e => setAnswers(a => a.map((v, idx) => idx === i ? e.target.value : v))}
              disabled={show}
            />
          </div>
        ))}
        {!show && (
          <button type="submit" className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Valider mes réponses</button>
        )}
        {show && (
          <div className="mt-2 text-green-700 font-bold">Réponses enregistrées ! (auto-correction non disponible)</div>
        )}
      </form>
    </div>
  );
}

export default QuizInteractive;
