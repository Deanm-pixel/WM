import React, { useEffect, useState, useContext } from 'react';
import API from '../../api/api';
import CommentForm from './CommentForm';
import { AuthContext } from '../../context/AuthContext';

export default function CommentList({ cardId }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    API.get(`/comments/${cardId}`)
      .then(res => setComments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [cardId]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Kommentare</h2>
      {loading ? (
        <p>Lädt...</p>
      ) : (
        <>
          {comments.length === 0 ? (
            <p>Keine Kommentare vorhanden.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map(comment => (
                <li key={comment._id} className="border p-3 rounded">
                  <p className="font-semibold">{comment.userName}</p>
                  <p>{comment.text}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {user && (
        <CommentForm cardId={cardId} onCommentAdded={fetchComments} />
      )}
    </div>
  );
}
