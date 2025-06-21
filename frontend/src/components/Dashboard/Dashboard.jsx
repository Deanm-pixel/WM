import React from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <p>Willkommen auf der Wissensplattform!</p>
        </main>
      </div>
    </div>
  );
}
