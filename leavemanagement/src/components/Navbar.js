import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const styles = {
    navbar: {
      backgroundColor: '#2563eb', // blue-600
      color: 'white',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    brand: {
      fontSize: '24px',
      fontWeight: 'bold'
    },
    links: {
      display: 'flex',
      gap: '12px'
    },
    link: {
      textDecoration: 'none',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'background-color 0.3s ease'
    },
    linkHover: {
      backgroundColor: '#1e40af' // darker blue on hover
    },
    logoutButton: {
      backgroundColor: '#ef4444', // red-500
      border: 'none',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    logoutHover: {
      backgroundColor: '#dc2626' // red-600
    }
  };

  // Combine base + hover using React's inline styles approach
  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Leave Manager</div>
      <div style={styles.links}>
        <Link
          to="/"
          style={styles.link}
          onMouseOver={e => e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Home/Login
        </Link>

        <Link
          to="/login"
          style={styles.link}
          onMouseOver={e => e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Employee Dashboard
        </Link>

        <Link
          to="/AdminDashboard"
          style={styles.link}
          onMouseOver={e => e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Admin Dashboard
        </Link>

        {user && (
          <button
            onClick={onLogout}
            style={styles.logoutButton}
            onMouseOver={e => e.currentTarget.style.backgroundColor = styles.logoutHover.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
