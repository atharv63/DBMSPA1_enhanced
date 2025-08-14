import React, { useEffect, useState } from 'react';
import API from '../api';
import LeaveHistory from './LeaveHistory';
import ApplyLeaveModal from './ApplyLeaveModal';
import EmployeeNavbar from './EmployeeNavbar';

function EmployeeDashboard({ user, onLogout }) {
  const [balance, setBalance] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [balanceRes, leavesRes] = await Promise.all([
        API.get(`/employee/leave-balance/${user.id}`),
        API.get(`/employee/leaves/${user.id}`)
      ]);
      setBalance(balanceRes.data || {});
      setLeaves(leavesRes.data || []);
    } catch (err) {
      console.error('Error fetching leave data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [user.id]);

  const handleLeaveSubmit = async (formData) => {
    try {
      await API.post('/employee/apply-leave', {
        userId: user.id,
        leaveType: formData.leave_type,
        fromDate: formData.from_date,
        toDate: formData.to_date,
        reason: formData.reason
      });
      fetchLeaveData();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to apply leave');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
          <div style={{ height: '48px', width: '48px', backgroundColor: '#6366f1', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
          <div style={{ height: '1rem', width: '25%', backgroundColor: '#d1d5db', margin: '0.25rem auto', borderRadius: '0.25rem' }}></div>
          <div style={{ height: '1rem', width: '50%', backgroundColor: '#d1d5db', margin: '0.25rem auto', borderRadius: '0.25rem' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1.5rem', maxWidth: '600px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{ height: '1.25rem', width: '1.25rem', color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p style={{ marginLeft: '1rem', color: '#b91c1c' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <EmployeeNavbar
        user={user}
        onLogout={onLogout}
        onApplyLeave={() => setShowModal(true)}
      />

      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>Employee Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize:'25px' }}>Welcome back, {user.name}</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Your Leave History</h2>
            <LeaveHistory leaves={leaves} />
          </div>
        </div>
      </main>

      {showModal && (
        <ApplyLeaveModal
          balance={balance}
          onClose={() => setShowModal(false)}
          onSubmit={handleLeaveSubmit}
        />
      )}
    </div>
  );
}

export default EmployeeDashboard;
