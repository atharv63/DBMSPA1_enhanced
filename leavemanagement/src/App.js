import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('leaveManagementUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('leaveManagementUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('leaveManagementUser');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          !user ? (
            <Login onLogin={handleLogin} />
          ) : user.role === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/employee" replace />
          )
        } />
        <Route path="/employee" element={
          user ? (
            user.role === 'employee' ? (
              <EmployeeDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/admin" element={
          user ? (
            user.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/employee" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;