import React, { useState } from 'react';
import API from '../api';

function Login({ onLogin }) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await API.post('/login', { email, password });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #eef2ff, #dbeafe)',
        padding: '2.5rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '768px', textAlign: 'center' }}>
        {!showForm ? (
          <div style={{ animation: 'fade-in 0.5s ease-in-out' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937' }}>
              Welcome to the Leave Management System
            </h1>
            <p
              style={{
                color: '#4b5563',
                fontSize: '1.125rem',
                maxWidth: '40rem',
                margin: '1rem auto',
              }}
            >
              Streamline your organization's leave process with ease. Employees can apply for leave,
              check balances, and view leave history. Admins can review, approve, reject, and manage
              employee leave records effortlessly from a central dashboard.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                padding: '0.75rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
            >
              Login to Continue
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              padding: '2rem',
              width: '100%',
              maxWidth: '28rem',
              margin: 'auto',
              animation: 'fade-in 0.5s ease-in-out',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937' }}>Welcome Back 👋</h2>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Please sign in to access your dashboard</p>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  borderRadius: '0.375rem',
                  border: '1px solid #fca5a5',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={loginUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: isLoading ? '#60a5fa' : '#2563eb',
                  color: '#fff',
                  fontWeight: '500',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
