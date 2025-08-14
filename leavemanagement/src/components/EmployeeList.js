import React, { useState } from 'react';

function EmployeeList({ employees, onDelete }) {
  const [confirmPopup, setConfirmPopup] = useState({ show: false, id: null, name: '' });

  const handleDeleteClick = (id, name) => {
    setConfirmPopup({ show: true, id, name });
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/employees/${confirmPopup.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error deleting employee: ${err.error || res.statusText}`);
        return;
      }

      onDelete(confirmPopup.id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete employee.');
    } finally {
      setConfirmPopup({ show: false, id: null, name: '' });
    }
  };

  const cancelDelete = () => {
    setConfirmPopup({ show: false, id: null, name: '' });
  };

  return (
    <>
      {/* Employee Table */}
      {employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h3>No employees found</h3>
          <p>Add some employees to get started.</p>
        </div>
      ) : (
        <div
          style={{
            overflowX: 'auto',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff',
            padding: '1rem'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4338ca', marginBottom: '1rem' }}>
            Employee Directory
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', color: '#ffffff' }}>
                {['Name', 'Email', 'Role', 'Leaves Taken', 'Actions'].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '0.75rem 1.5rem',
                      textAlign: header === 'Actions' ? 'right' : 'left',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem' }}>{employee.name}</td>
                  <td style={{ padding: '1rem' }}>{employee.email}</td>
                  <td style={{ padding: '1rem' }}>{employee.role}</td>
                  <td style={{ padding: '1rem' }}>{employee.leaves_taken}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteClick(employee.id, employee.name)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Confirmation Popup */}
      {confirmPopup.show && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
              Confirm Deletion
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
              Are you sure you want to delete <strong>{confirmPopup.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: '#6b7280',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeList;
