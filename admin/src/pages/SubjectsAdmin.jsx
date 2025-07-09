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
                        <span className="text-gray-700 dark:text-gray-200 break-words">{course.content}</span>
                        <button onClick={() => handleEditCourse(s._id, course)} className="px-2 py-1 bg-violet-500 text-white rounded text-xs">Éditer</button>
                        <button onClick={() => handleDeleteCourse(s._id, course._id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Supprimer</button>
                      </>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsAdmin;
