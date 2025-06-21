import React, { useState } from 'react';
import API from '../../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await API.post('/auth/register', { name, email, password, role });
      alert('Registrierung erfolgreich! Bitte einloggen.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registrierung fehlgeschlagen.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-3xl mb-6 text-center">Registrieren</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Registrieren
        </button>
      </form>
      <p className="mt-4 text-center">
        Bereits registriert?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
