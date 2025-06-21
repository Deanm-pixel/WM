import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import { AuthContext } from '../../context/AuthContext';

export default function CardForm() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      API.get(`/cards/${id}`)
        .then(res => {
          const card = res.data;
          if (
            user.role !== 'admin' &&
            user.role !== 'editor' &&
            card.creatorId !== user._id
          ) {
            alert('Keine Berechtigung');
            navigate('/cards');
            return;
          }
          setTitle(card.title);
          setContent(card.content);
          setExpirationDate(card.expirationDate?.slice(0, 10) || '');
        })
        .catch(() => {
          alert('Karte nicht gefunden');
          navigate('/cards');
        });
    }
  }, [id, navigate, user]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await API.put(`/cards/${id}`, {
          title,
          content,
          expirationDate
        });
      } else {
        await API.post('/cards', {
          title,
          content,
          expirationDate
        });
      }
      navigate('/cards');
    } catch (err) {
      setError('Fehler beim Speichern der Karte.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{id ? 'Karte bearbeiten' : 'Neue Karte erstellen'}</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <textarea
              placeholder="Inhalt"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              required
              className="w-full p-3 border rounded"
            />
            <label className="block">
              Ablaufdatum (optional):
              <input
                type="date"
                value={expirationDate}
                onChange={e => setExpirationDate(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
              Speichern
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
