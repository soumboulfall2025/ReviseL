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

const RevisionCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/subjects/all-courses`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Erreur chargement fiches.');
        return res.json();
      })
      .then((data) => {
        setCards(data);
        toast.success('Fiches chargées !');
      })
      .catch((e) => {
        setError(e.message || 'Erreur chargement fiches.');
        toast.error('Erreur lors du chargement.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-2 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div key={card._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 border-t-4" style={{ borderColor: card.subject?.color || '#a78bfa' }}>
          <div className="text-xs text-gray-400 mb-1">{card.subject?.name}</div>
          <h3 className="text-lg font-bold text-violet-700 mb-2">{card.title}</h3>
          {renderContent(card.content)}
          {card.questions && Array.isArray(card.questions) && (
            <div className="mt-3">
              <div className="font-semibold text-green-700 mb-1">Quiz :</div>
              <ul className="list-decimal list-inside ml-4 space-y-1">
                {card.questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RevisionCards;
