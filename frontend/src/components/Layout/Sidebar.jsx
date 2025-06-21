import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="w-48 bg-gray-100 min-h-screen p-4">
      <ul className="space-y-3">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'font-bold text-blue-700' : 'text-gray-700'
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/cards"
            className={({ isActive }) =>
              isActive ? 'font-bold text-blue-700' : 'text-gray-700'
            }
          >
            Karten
          </NavLink>
        </li>
        {(user?.role === 'admin' || user?.role === 'editor') && (
          <li>
            <NavLink
              to="/cards/new"
              className={({ isActive }) =>
                isActive ? 'font-bold text-blue-700' : 'text-gray-700'
              }
            >
              Neue Karte erstellen
            </NavLink>
          </li>
        )}
        {user?.role === 'admin' && (
          <li>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                isActive ? 'font-bold text-blue-700' : 'text-gray-700'
              }
            >
              Statistiken
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
