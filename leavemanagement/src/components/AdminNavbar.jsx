import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminNavbar({ onToggleEmployees, showEmployees, onLogout }) {
  const navigate = useNavigate();

  const styles = {
    navbar: {
      backgroundColor: '#2563eb',
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
    buttons: {
      display: 'flex',
      gap: '12px'
    },
    btn: {
      backgroundColor: '#3b82f6',
      border: 'none',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s ease'
    },
    btnHover: {
      backgroundColor: '#1e40af'
    },
    logoutBtn: {
      backgroundColor: '#ef4444',
      border: 'none',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s ease'
    },
    logoutHover: {
      backgroundColor: '#dc2626'
    }
  };

  // Helper for hover effect
  const handleMouseOver = (e, hoverColor) => {
    e.currentTarget.style.backgroundColor = hoverColor;
  };

  const handleMouseOut = (e, defaultColor) => {
    e.currentTarget.style.backgroundColor = defaultColor;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Admin Dashboard</div>
      <div style={styles.buttons}>

        {/* View Employees */}
        <button
          style={styles.btn}
          onMouseOver={e => handleMouseOver(e, styles.btnHover.backgroundColor)}
          onMouseOut={e => handleMouseOut(e, styles.btn.backgroundColor)}
          onClick={onToggleEmployees}
        >
          {showEmployees ? 'Hide Employees' : 'View Employees'}
        </button>

        {/* Remaining Leave Balance */}
        <button
          style={styles.btn}
          onMouseOver={e => handleMouseOver(e, styles.btnHover.backgroundColor)}
          onMouseOut={e => handleMouseOut(e, styles.btn.backgroundColor)}
          onClick={() => navigate('/RemainingLeaveBalance')}
        >
          Remaining Leave Balance
        </button>

        {/* Logout */}
        <button
          style={styles.logoutBtn}
          onMouseOver={e => handleMouseOver(e, styles.logoutHover.backgroundColor)}
          onMouseOut={e => handleMouseOut(e, styles.logoutBtn.backgroundColor)}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
