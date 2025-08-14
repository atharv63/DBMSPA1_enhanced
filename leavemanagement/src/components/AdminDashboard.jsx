import React, { useEffect, useState } from 'react';
import API from '../api';
import EmployeeList from './EmployeeList';
import AdminNavbar from './AdminNavbar';

function AdminDashboard({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployees, setShowEmployees] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReports, setShowReports] = useState(false);

  // Helper: sort requests
  const sortRequests = (data) => {
    return data.sort((a, b) => {
      // Pending first
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;

      // If both have same status, sort by from_date (newest first)
      return new Date(b.from_date) - new Date(a.from_date);
    });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const requestsRes = await API.get('/admin/leave-requests');
        setRequests(sortRequests(requestsRes.data));
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/admin/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const handleToggleEmployees = () => {
    if (!showEmployees) {
      fetchEmployees().then(() => {
        setTimeout(() => {
          document.getElementById('employee-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
    setShowEmployees(!showEmployees);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleAction = async (leaveId, action) => {
    try {
      if (action === 'approve') {
        await API.post('/admin/approve-leave', { leaveId, adminId: user.id });
      } else {
        await API.post('/admin/reject-leave', {
          leaveId,
          adminId: user.id,
          remarks: 'Rejected by admin'
        });
      }

      const { data } = await API.get('/admin/leave-requests');
      setRequests(sortRequests(data));

    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process leave');
    }
  };

  const containerStyle = {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    marginBottom: '2rem'
  };

  const approveBtn = {
    backgroundColor: 'green',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '0.5rem'
  };

  const rejectBtn = {
    backgroundColor: 'red',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const statusColor = (status) => {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return '#f59e0b'; // pending
  };

  return (
    <>
      <AdminNavbar
        onToggleEmployees={handleToggleEmployees}
        showEmployees={showEmployees}
        onToggleReports={() => setShowReports(prev => !prev)}
        onLogout={onLogout}
      />

      <div style={containerStyle}>
        {showReports ? (
          <div style={cardStyle}>
            <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>Reports</h2>
          </div>
        ) : (
          <>
            {/* LEAVE REQUESTS */}
            <div style={cardStyle}>
              <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>Leave Requests</h2>
              {requests.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No leave requests available.</p>
              ) : (
                requests.map(req => (
                  <div key={req.leave_id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    backgroundColor: '#f3f4f6'
                  }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{req.employee_name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{req.leave_type}</p>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{req.from_date} → {req.to_date}</p>
                    <p style={{ marginTop: '0.25rem' }}>
                      Status:{' '}
                      <span style={{ fontWeight: '600', color: statusColor(req.status) }}>{req.status}</span>
                    </p>
                    {req.status === 'pending' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <button onClick={() => handleAction(req.leave_id, 'approve')} style={approveBtn}>Approve</button>
                        <button onClick={() => handleAction(req.leave_id, 'reject')} style={rejectBtn}>Reject</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* EMPLOYEE LIST */}
            {showEmployees && (
              <div id="employee-section" style={cardStyle}>
                <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>Employee List</h2>
                <EmployeeList employees={employees} onDelete={handleDeleteEmployee} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
