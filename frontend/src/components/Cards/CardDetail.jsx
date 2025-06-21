import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import CommentList from '../Comments/CommentList';
import { AuthContext } from '../../context/AuthContext';

export default function CardDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/cards/${id}`)
      .then(res => setCard(res.data))
      .catch(() => alert('Karte nicht gefunden'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Karte wirklich löschen?')) {
      try {
        await API.delete(`/cards/${id}`);
        alert('Karte gelöscht');
        navigate('/cards');
      } catch (err) {
        alert('Löschen fehlgeschlagen');
      }
    }
  };

  if (loading) return <p>Lädt...</p>;
  if (!card) return <p>Karte nicht gefunden.</p>;

  const canEdit =
    user.role === 'admin' ||
    user.role === 'editor' ||
    (user.role === 'user' && card.creatorId === user._id);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">{card.title}</h1>
          <p className="mb-6 whitespace-pre-line">{card.content}</p>
          {canEdit && (
            <div className="space-x-3 mb-6">
              <Link
                to={`/cards/${id}/edit`}
                className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600"
              >
                Bearbeiten
              </Link>
              {(user.role === 'admin' || user.role === 'editor') && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
                >
                  Löschen
                </button>
              )}
            </div>
          )}

          <CommentList cardId={id} />
        </main>
      </div>
    </div>
  );
}
