import React, { useState, useContext } from 'react';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function CommentForm({ cardId, onCommentAdded }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!text.trim()) {
      setError('Kommentar darf nicht leer sein');
      return;
    }
    try {
      await API.post(`/comments/${cardId}`, { text });
      setText('');
      onCommentAdded();
    } catch {
      setError('Fehler beim Hinzufügen des Kommentars');
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      {error && <p className="text-red-600">{error}</p>}
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="Kommentar schreiben..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Kommentar hinzufügen
      </button>
    </form>
  );
}
