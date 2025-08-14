import React from 'react';

function EmployeeNavbar({ user, onLogout, onApplyLeave }) {
  return (
    <nav style={{ backgroundColor: '#1f2937', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <strong>Leave Management</strong>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        
        
        <button 
          onClick={onApplyLeave} 
          style={{
            backgroundColor: '#10b981',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Apply Leave
        </button>

        <button 
          onClick={onLogout} 
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default EmployeeNavbar;
