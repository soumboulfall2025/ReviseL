import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le quiz dynamique envoyé via navigate state
  const quizData = location.state?.quiz;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Si aucun quiz n'est passé, affiche un message d'erreur et retour
  if (!quizData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold mb-4">Aucun quiz sélectionné.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-violet-600 text-white font-bold hover:bg-green-600 transition-all">Retour</button>
      </div>
    );
  }

  const current = quizData.questions[step];

  const handleAnswer = (choix) => {
    setAnswers([...answers, choix]);
    if (step < quizData.questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const score = answers.filter((a, i) => a === quizData.questions[i].reponse).length;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 rounded-full bg-violet-600 text-white font-bold shadow hover:bg-green-600 transition-all flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </button>

      <h2 className="text-2xl font-bold mb-2 text-green-700">{quizData.titre}</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{quizData.instructions}</p>

      {!showResult ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border-t-4 border-violet-400 animate-fadeIn">
          <div className="text-lg font-semibold mb-4 text-violet-700">{current.question}</div>
          <div className="grid gap-3">
            {current.choix.map((c) => (
              <button
                key={c}
                className="w-full px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 transition-all text-left font-medium"
                onClick={() => handleAnswer(c)}
                disabled={answers.length > step}
              >
                {c}
              </button>
            ))}
          </div>

          {answers[step] && (
            <div
              className={`mt-4 p-3 rounded ${
                answers[step] === current.reponse ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {answers[step] === current.reponse ? 'Bonne réponse !' : 'Mauvaise réponse.'}
              <div className="mt-2 text-sm text-gray-600">{current.explication}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border-t-4 border-green-400 animate-fadeIn">
          <div className="text-2xl font-bold text-green-700 mb-2">Résultat</div>
          <div className="text-lg mb-4">Score : {score} / {quizData.questions.length}</div>
          <ul className="mb-4">
            {quizData.questions.map((q, i) => (
              <li key={q.id} className="mb-2">
                <span className="font-semibold">{q.question}</span><br />
                <span className={answers[i] === q.reponse ? 'text-green-700' : 'text-red-700'}>
                  Votre réponse : {answers[i] || <em>Non répondu</em>}
                </span><br />
                <span className="text-gray-600 text-sm">Bonne réponse : {q.reponse}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setStep(0);
              setAnswers([]);
              setShowResult(false);
            }}
            className="px-4 py-2 rounded bg-violet-600 text-white font-bold hover:bg-green-600 transition-all"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
