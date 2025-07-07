import React, { useState } from 'react';
import { useAuth } from '../features/authContext.jsx';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, CameraIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, login } = useAuth();
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photo, setPhoto] = useState(user?.photo || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ username, email, phone, photo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      login(user.token, data); // met à jour le contexte et le localStorage
      setMessage('Profil mis à jour !');
      setEdit(false);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center gap-6">
      <div className="relative">
        {photo ? (
          <img src={photo} alt="Profil" className="w-28 h-28 rounded-full object-cover border-4 border-green-500" />
        ) : (
          <UserCircleIcon className="w-28 h-28 text-gray-400" />
        )}
        {edit && (
          <label className="absolute bottom-2 right-2 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition">
            <CameraIcon className="w-5 h-5 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        )}
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 dark:text-gray-200">Nom&nbsp;:</span>
          {edit ? (
            <input value={username} onChange={e => setUsername(e.target.value)} className="border rounded px-2 py-1 w-full" />
          ) : (
            <span>{username}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="w-5 h-5 text-violet-500" />
          {edit ? (
            <input value={email} onChange={e => setEmail(e.target.value)} className="border rounded px-2 py-1 w-full" />
          ) : (
            <span>{email}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-green-500" />
          {edit ? (
            <input value={phone} onChange={e => setPhone(e.target.value)} className="border rounded px-2 py-1 w-full" placeholder="Numéro de téléphone" />
          ) : (
            <span>{phone || <span className="italic text-gray-400">Non renseigné</span>}</span>
          )}
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        {edit ? (
          <>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button onClick={() => setEdit(false)} className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition">Annuler</button>
          </>
        ) : (
          <button onClick={() => setEdit(true)} className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 transition">Modifier le profil</button>
        )}
      </div>
      {message && <div className="mt-4 text-center text-red-500">{message}</div>}
    </div>
  );
};

export default Profile;
