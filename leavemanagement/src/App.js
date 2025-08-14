import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import RemainingLeaveBalance from './components/RemainingLeaveBalance';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('leaveManagementUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('leaveManagementUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('leaveManagementUser');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/employee" replace />
            )
          }
        />

        {/* Employee Dashboard */}
        <Route
          path="/employee"
          element={
            user ? (
              user.role === 'employee' ? (
                <EmployeeDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            user ? (
              user.role === 'admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/employee" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Remaining Leave Balance Page (Admin Only) */}
        <Route
          path="/remainingleavebalance"
          element={
            user ? (
              user.role === 'admin' ? (
                <RemainingLeaveBalance user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/employee" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
