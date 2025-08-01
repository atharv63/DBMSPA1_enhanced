import React, { useEffect, useState } from 'react';
import API from '../api';
import Sidebar from './Sidebar';
import LeaveHistory from './LeaveHistory';
import ApplyLeaveModal from './ApplyLeaveModal';

function EmployeeDashboard({ user, onLogout }) {
  const [balance, setBalance] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const balanceRes = await API.get(`/employee/leave-balance/${user.id}`);
        setBalance(balanceRes.data || {});
        
        const leavesRes = await API.get(`/employee/leaves/${user.id}`);
        setLeaves(leavesRes.data || []);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleLeaveSubmit = async (formData) => {
    try {
      await API.post('/employee/apply-leave', {
        userId: user.id,
        ...formData
      });
      
      // Refresh data
      const [balanceRes, leavesRes] = await Promise.all([
        API.get(`/employee/leave-balance/${user.id}`),
        API.get(`/employee/leaves/${user.id}`)
      ]);
      
      setBalance(balanceRes.data || {});
      setLeaves(leavesRes.data || []);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply leave');
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar balance={balance} />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Apply Leave
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}</h2>
          <h3 className="text-xl font-semibold mb-4">Your Leave History</h3>
          <LeaveHistory leaves={leaves} />
        </div>
      </div>

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