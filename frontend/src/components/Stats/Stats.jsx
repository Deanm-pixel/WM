import React, { useEffect, useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import API from '../../api/api';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Statistiken</h1>
          {loading && <p>Lade Statistiken...</p>}
          {stats && (
            <div className="space-y-4">
              <p>Karten gesamt: {stats.totalCards}</p>
              <p>Kommentare gesamt: {stats.totalComments}</p>
              <p>Aktive Benutzer: {stats.activeUsers}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
