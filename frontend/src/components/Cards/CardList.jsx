import React, { useEffect, useState, useContext } from 'react';
import API from '../../api/api';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import { AuthContext } from '../../context/AuthContext';

export default function CardList() {
  const { user } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/cards')
      .then(res => setCards(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Alle Karten</h1>
          {loading ? (
            <p>Lade Karten...</p>
          ) : (
            <ul className="space-y-4">
              {cards.map(card => (
                <li
                  key={card._id}
                  className="p-4 border rounded hover:shadow cursor-pointer"
                >
                  <Link to={`/cards/${card._id}`}>
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="text-gray-600 truncate">{card.content}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
