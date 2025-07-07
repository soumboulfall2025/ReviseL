import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ userCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setError('Erreur chargement utilisateurs.'));
    fetch(`${API_URL}/api/auth/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setError('Erreur chargement stats.'));
    setLoading(false);
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.filter(u => u._id !== id));
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditRole = (id, currentRole) => {
    setEditId(id);
    setEditRole(currentRole);
  };

  const handleSaveRole = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: editRole })
    });
    setUsers(users.map(u => u._id === id ? { ...u, role: editRole } : u));
    setEditId(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Panel Admin</h1>
      <div className="mb-6">Utilisateurs inscrits : <span className="font-bold text-green-600">{stats.userCount}</span></div>
      <input
        type="text"
        placeholder="Rechercher par nom ou email..."
        className="mb-4 p-2 border rounded w-full max-w-xs"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full w-full border rounded-lg text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 whitespace-nowrap">Nom</th>
              <th className="p-2 whitespace-nowrap">Email</th>
              <th className="p-2 whitespace-nowrap">Rôle</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-2 break-all max-w-[120px]">{u.username}</td>
                <td className="p-2 break-all max-w-[180px]">{u.email}</td>
                <td className="p-2">
                  {editId === u._id ? (
                    <select value={editRole} onChange={e => setEditRole(e.target.value)} className="border rounded p-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td className="p-2 flex flex-col sm:flex-row gap-2">
                  {editId === u._id ? (
                    <>
                      <button onClick={() => handleSaveRole(u._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 transition">Enregistrer</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-300 px-2 py-1 rounded">Annuler</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditRole(u._id, u.role)} className="bg-violet-500 text-white px-2 py-1 rounded hover:bg-violet-700 transition">Éditer rôle</button>
                      <button onClick={() => handleDelete(u._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition">Supprimer</button>
                      <Link to={`/etudiant/${u._id}`} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-center">Évolution</Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
