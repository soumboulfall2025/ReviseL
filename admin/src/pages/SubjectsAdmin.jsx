import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL + '/api/subjects';

const colors = [
  '#a78bfa', // violet
  '#34d399', // green
  '#fbbf24', // yellow
  '#f87171', // red
  '#60a5fa', // blue
  '#f472b6', // pink
];

const SubjectsAdmin = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState({}); // {subjectId: [cours]}
  const [newCourse, setNewCourse] = useState({}); // {subjectId: {title, content}}
  const [editCourse, setEditCourse] = useState({}); // {subjectId: {id, title, content}}
  const [quizEdit, setQuizEdit] = useState({}); // { [courseId]: [questions] }
  const [quizEditVisible, setQuizEditVisible] = useState({}); // { [courseId]: bool }

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(async data => {
        setSubjects(data);
        // fetch les cours pour chaque matière
        const allCourses = {};
        for (const s of data) {
          const res = await fetch(`${API}/${s._id}/courses`, { headers: { Authorization: `Bearer ${token}` } });
          allCourses[s._id] = await res.json();
        }
        setCourses(allCourses);
      })
      .catch(() => setError('Erreur chargement matières.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description, color })
    });
    const data = await res.json();
    if (res.ok) setSubjects([...subjects, data]);
    setName(''); setDescription(''); setColor(colors[0]);
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setSubjects(subjects.filter(s => s._id !== id));
  };

  const handleEdit = (s) => {
    setEditId(s._id); setName(s.name); setDescription(s.description); setColor(s.color);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description, color })
    });
    const data = await res.json();
    setSubjects(subjects.map(s => s._id === editId ? data : s));
    setEditId(null); setName(''); setDescription(''); setColor(colors[0]);
  };

  // Ajout d'un cours (classique ou JSON structuré)
  const handleAddCourse = async (subjectId) => {
    const { title, content, json } = newCourse[subjectId] || {};
    let body;
    if (json && json.trim()) {
      try {
        body = JSON.parse(json);
        // Validation avancée : questions et corrections obligatoires si présents
        if (body.questions && (!Array.isArray(body.questions) || body.questions.length === 0)) {
          setError('Le champ "questions" doit être un tableau non vide.');
          return;
        }
        if (body.corrections && (!Array.isArray(body.corrections) || body.corrections.length !== body.questions.length)) {
          setError('Le champ "corrections" doit être un tableau de même longueur que "questions".');
          return;
        }
      } catch {
        setError('JSON invalide');
        return;
      }
    } else {
      body = { title, content };
    }
    const res = await fetch(`${API}/${subjectId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const newC = await res.json();
      setCourses({ ...courses, [subjectId]: [...(courses[subjectId] || []), newC] });
      setNewCourse({ ...newCourse, [subjectId]: {} });
      setError('');
    } else {
      setError('Erreur ajout cours');
    }
  };

  // Suppression d'un cours
  const handleDeleteCourse = async (subjectId, courseId) => {
    await fetch(`${API}/${subjectId}/courses/${courseId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    // Recharge la liste des cours depuis l'API pour éviter tout cache ou désynchro
    const res = await fetch(`${API}/${subjectId}/courses`, { headers: { Authorization: `Bearer ${token}` } });
    const updatedCourses = await res.json();
    setCourses({ ...courses, [subjectId]: updatedCourses });
  };

  // Edition d'un cours
  const handleEditCourse = (subjectId, course) => {
    setEditCourse({ ...editCourse, [subjectId]: { ...course } });
  };

  // Validation de l'édition
  const handleUpdateCourse = async (subjectId) => {
    const { _id, title, content } = editCourse[subjectId];
    const res = await fetch(`${API}/${subjectId}/courses/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    setCourses({ ...courses, [subjectId]: (courses[subjectId] || []).map(c => c._id === _id ? data : c) });
    setEditCourse({ ...editCourse, [subjectId]: null });
  };

  // Ouvre le formulaire d'édition du quiz
  const handleEditQuiz = (subjectId, course) => {
    setQuizEditVisible({ ...quizEditVisible, [course._id]: true });
    setQuizEdit({ ...quizEdit, [course._id]: course.quiz ? JSON.parse(JSON.stringify(course.quiz)) : [] });
  };

  // Ferme le formulaire d'édition du quiz
  const handleCloseQuizEdit = (courseId) => {
    setQuizEditVisible({ ...quizEditVisible, [courseId]: false });
  };

  // Ajoute une question
  const handleAddQuizQuestion = (courseId) => {
    setQuizEdit({
      ...quizEdit,
      [courseId]: [
        ...(quizEdit[courseId] || []),
        { question: '', choices: ['', ''], answer: 0, explanation: '' }
      ]
    });
  };

  // Modifie une question/choix
  const handleQuizChange = (courseId, idx, field, value) => {
    const updated = [...(quizEdit[courseId] || [])];
    updated[idx][field] = value;
    setQuizEdit({ ...quizEdit, [courseId]: updated });
  };

  // Modifie un choix
  const handleQuizChoiceChange = (courseId, idx, choiceIdx, value) => {
    const updated = [...(quizEdit[courseId] || [])];
    updated[idx].choices[choiceIdx] = value;
    setQuizEdit({ ...quizEdit, [courseId]: updated });
  };

  // Ajoute un choix
  const handleAddChoice = (courseId, idx) => {
    const updated = [...(quizEdit[courseId] || [])];
    updated[idx].choices.push('');
    setQuizEdit({ ...quizEdit, [courseId]: updated });
  };

  // Supprime un choix
  const handleRemoveChoice = (courseId, idx, choiceIdx) => {
    const updated = [...(quizEdit[courseId] || [])];
    updated[idx].choices.splice(choiceIdx, 1);
    setQuizEdit({ ...quizEdit, [courseId]: updated });
  };

  // Supprime une question
  const handleRemoveQuizQuestion = (courseId, idx) => {
    const updated = [...(quizEdit[courseId] || [])];
    updated.splice(idx, 1);
    setQuizEdit({ ...quizEdit, [courseId]: updated });
  };

  // Sauvegarde le quiz dans le backend
  const handleSaveQuiz = async (subjectId, course) => {
    const quiz = quizEdit[course._id] || [];
    const res = await fetch(`${API}/${subjectId}/courses/${course._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...course, quiz })
    });
    if (res.ok) {
      // Recharge les cours
      const updatedCourses = await fetch(`${API}/${subjectId}/courses`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
      setCourses({ ...courses, [subjectId]: updatedCourses });
      setQuizEditVisible({ ...quizEditVisible, [course._id]: false });
    } else {
      setError('Erreur lors de la sauvegarde du quiz');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-700 dark:text-green-400">Gestion des matières</h2>
      <form onSubmit={editId ? handleUpdate : handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="Nom de la matière"
          className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-1"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optionnelle)"
          className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-1"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select value={color} onChange={e => setColor(e.target.value)} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {colors.map(c => <option key={c} value={c} style={{ background: c }}>{c}</option>)}
        </select>
        <button type="submit" className="px-4 py-2 rounded bg-violet-600 hover:bg-green-600 text-white font-bold transition-all">
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setDescription(''); setColor(colors[0]); }} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold">Annuler</button>}
      </form>
      <div className="grid grid-cols-1 gap-4">
        {subjects.map(s => (
          <div key={s._id} className="rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100 dark:border-gray-800 w-full overflow-x-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-3 h-3 rounded-full" style={{ background: s.color }}></span>
              <span className="font-bold text-lg text-gray-800 dark:text-gray-100 break-words">{s.name}</span>
            </div>
            <div className="text-gray-500 text-sm break-words">{s.description}</div>
            {/* Liste des cours */}
            <div className="mt-2">
              <div className="font-semibold text-violet-700 dark:text-green-400 mb-1">Cours</div>
              <div className="flex flex-col gap-2 w-full">
                {(courses[s._id] || []).map(course => (
                  <div key={course._id} className="bg-white dark:bg-gray-800 rounded p-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 border border-gray-200 dark:border-gray-700 w-full">
                    {editCourse[s._id] && editCourse[s._id]._id === course._id ? (
                      <>
                        <input value={editCourse[s._id].title} onChange={e => setEditCourse({ ...editCourse, [s._id]: { ...editCourse[s._id], title: e.target.value } })} className="p-1 rounded border flex-1 min-w-0" />
                        <input value={editCourse[s._id].content} onChange={e => setEditCourse({ ...editCourse, [s._id]: { ...editCourse[s._id], content: e.target.value } })} className="p-1 rounded border flex-1 min-w-0" />
                        <button onClick={() => handleUpdateCourse(s._id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Valider</button>
                        <button onClick={() => setEditCourse({ ...editCourse, [s._id]: null })} className="px-2 py-1 bg-gray-300 text-gray-800 rounded text-xs">Annuler</button>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-green-700 break-words">{course.title}</span>
                        <span className="text-gray-700 dark:text-gray-200 break-words">
                          {typeof course.content === 'string'
                            ? course.content
                            : <pre className="whitespace-pre-wrap">{JSON.stringify(course.content, null, 2)}</pre>
                          }
                        </span>
                        <button onClick={() => handleEditCourse(s._id, course)} className="px-2 py-1 bg-violet-500 text-white rounded text-xs">Éditer</button>
                        <button onClick={() => handleDeleteCourse(s._id, course._id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Supprimer</button>
                      </>
                    )}
                    {/* Ajout bouton gérer quiz */}
                    <button onClick={() => handleEditQuiz(s._id, course)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Gérer le quiz</button>
                    {/* Formulaire dynamique quiz */}
                    {quizEditVisible[course._id] && (
                      <div className="w-full bg-violet-50 dark:bg-violet-900 border border-violet-300 dark:border-violet-700 rounded p-3 mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-violet-700">Édition du quiz</span>
                          <button onClick={() => handleCloseQuizEdit(course._id)} className="text-xs text-red-500">Fermer</button>
                        </div>
                        {(quizEdit[course._id] || []).map((q, idx) => (
                          <div key={idx} className="mb-4 p-2 border-b border-violet-200">
                            <input
                              type="text"
                              className="w-full p-1 mb-1 rounded border"
                              placeholder="Question"
                              value={q.question}
                              onChange={e => handleQuizChange(course._id, idx, 'question', e.target.value)}
                            />
                            <div className="flex flex-col gap-1 mb-1">
                              {q.choices.map((choice, cidx) => (
                                <div key={cidx} className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    className="p-1 rounded border flex-1"
                                    placeholder={`Choix ${cidx + 1}`}
                                    value={choice}
                                    onChange={e => handleQuizChoiceChange(course._id, idx, cidx, e.target.value)}
                                  />
                                  <button type="button" onClick={() => handleRemoveChoice(course._id, idx, cidx)} className="text-xs text-red-500">✕</button>
                                </div>
                              ))}
                              <button type="button" onClick={() => handleAddChoice(course._id, idx)} className="text-xs text-violet-600">+ Ajouter un choix</button>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <label className="text-xs">Bonne réponse :</label>
                              <select value={q.answer} onChange={e => handleQuizChange(course._id, idx, 'answer', Number(e.target.value))} className="p-1 rounded border">
                                {q.choices.map((_, cidx) => (
                                  <option key={cidx} value={cidx}>{`Choix ${cidx + 1}`}</option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              className="w-full p-1 rounded border"
                              placeholder="Explication (optionnelle)"
                              value={q.explanation}
                              onChange={e => handleQuizChange(course._id, idx, 'explanation', e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveQuizQuestion(course._id, idx)} className="mt-1 text-xs text-red-500">Supprimer la question</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleAddQuizQuestion(course._id)} className="px-2 py-1 bg-violet-600 text-white rounded text-xs mb-2">+ Ajouter une question</button>
                        <button type="button" onClick={() => handleSaveQuiz(s._id, course)} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold">Sauvegarder le quiz</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Formulaire ajout cours */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 mb-2 text-xs font-mono text-gray-600 dark:text-gray-300">
                Exemple&nbsp;:<br />
                {'{'}<br />
                &nbsp;&nbsp;"titre": "Titre du cours",<br />
                &nbsp;&nbsp;"questions": ["Question 1 ?", "Question 2 ?"],<br />
                &nbsp;&nbsp;"corrections": ["Réponse 1", "Réponse 2"]<br />
                {'}'}
              </div>
              <form onSubmit={e => { e.preventDefault(); handleAddCourse(s._id); }} className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                <input
                  type="text"
                  placeholder="Titre du cours"
                  className="p-1 rounded border flex-1 min-w-0"
                  value={newCourse[s._id]?.title || ''}
                  onChange={e => setNewCourse({ ...newCourse, [s._id]: { ...newCourse[s._id], title: e.target.value } })}
                  required={!newCourse[s._id]?.json}
                />
                <input
                  type="text"
                  placeholder="Contenu du cours"
                  className="p-1 rounded border flex-1 min-w-0"
                  value={newCourse[s._id]?.content || ''}
                  onChange={e => setNewCourse({ ...newCourse, [s._id]: { ...newCourse[s._id], content: e.target.value } })}
                  required={!newCourse[s._id]?.json}
                />
                <textarea
                  placeholder="JSON structuré (optionnel, prioritaire)"
                  className="p-1 rounded border flex-1 min-w-0 font-mono text-xs"
                  rows={5}
                  value={newCourse[s._id]?.json || ''}
                  onChange={e => setNewCourse({ ...newCourse, [s._id]: { ...newCourse[s._id], json: e.target.value } })}
                />
                <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded text-xs">Ajouter</button>
              </form>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <button onClick={() => handleEdit(s)} className="px-3 py-1 rounded bg-violet-500 hover:bg-violet-700 text-white text-xs font-bold">Éditer</button>
              <button onClick={() => handleDelete(s._id)} className="px-3 py-1 rounded bg-red-500 hover:bg-red-700 text-white text-xs font-bold">Supprimer</button>
            </div>
            {/* Édition du quiz */}
            <div className="mt-4">
              <button onClick={() => handleEditQuiz(s._id, courses[s._id][0])} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">
                {quizEditVisible[courses[s._id][0]?._id] ? 'Fermer' : 'Éditer le quiz'}
              </button>
              {quizEditVisible[courses[s._id][0]?._id] && (
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Édition du quiz</div>
                  {quizEdit[courses[s._id][0]?._id]?.map((q, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded p-2 mb-2 border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Question"
                          className="p-1 rounded border flex-1 min-w-0"
                          value={q.question}
                          onChange={e => handleQuizChange(courses[s._id][0]?._id, idx, 'question', e.target.value)}
                        />
                        <button onClick={() => handleRemoveQuizQuestion(courses[s._id][0]?._id, idx)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Supprimer la question</button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        {q.choices.map((choice, choiceIdx) => (
                          <div key={choiceIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`Choix ${choiceIdx + 1}`}
                              className="p-1 rounded border flex-1 min-w-0"
                              value={choice}
                              onChange={e => handleQuizChoiceChange(courses[s._id][0]?._id, idx, choiceIdx, e.target.value)}
                            />
                            <button onClick={() => handleRemoveChoice(courses[s._id][0]?._id, idx, choiceIdx)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Supprimer</button>
                          </div>
                        ))}
                        <button onClick={() => handleAddChoice(courses[s._id][0]?._id, idx)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Ajouter un choix</button>
                      </div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Réponse correcte</label>
                        <select
                          value={q.answer}
                          onChange={e => handleQuizChange(courses[s._id][0]?._id, idx, 'answer', parseInt(e.target.value))}
                          className="mt-1 p-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        >
                          {q.choices.map((_, i) => (
                            <option key={i} value={i}>{`Choix ${i + 1}`}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Explication (optionnelle)</label>
                        <textarea
                          placeholder="Explication de la réponse"
                          className="p-1 rounded border flex-1 min-w-0 font-mono text-xs"
                          rows={2}
                          value={q.explanation}
                          onChange={e => handleQuizChange(courses[s._id][0]?._id, idx, 'explanation', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleAddQuizQuestion(courses[s._id][0]?._id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Ajouter une question</button>
                    <button onClick={() => handleSaveQuiz(s._id, courses[s._id][0])} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Sauvegarder le quiz</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsAdmin;
