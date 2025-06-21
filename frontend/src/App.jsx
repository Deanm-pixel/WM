import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CardList from './components/Cards/CardList';
import CardDetail from './components/Cards/CardDetail';
import CardForm from './components/Cards/CardForm';
import Stats from './components/Stats/Stats';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cards"
          element={
            <PrivateRoute>
              <CardList />
            </PrivateRoute>
          }
        />

        <Route
          path="/cards/new"
          element={
            <PrivateRoute roles={['admin', 'editor']}>
              <CardForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/cards/:id"
          element={
            <PrivateRoute>
              <CardDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/cards/:id/edit"
          element={
            <PrivateRoute roles={['admin', 'editor']}>
              <CardForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <PrivateRoute roles={['admin']}>
              <Stats />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
