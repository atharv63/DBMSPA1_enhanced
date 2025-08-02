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
      <div className="flex min-h-screen">
        <Sidebar balance={balance} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary rounded-full mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar balance={balance} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar balance={balance} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employee Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(true)}
                className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Apply Leave
              </button>
              
              <button
                onClick={onLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Leave History</h2>
              <LeaveHistory leaves={leaves} />
            </div>
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