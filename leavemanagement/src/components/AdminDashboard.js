import React, { useEffect, useState } from 'react';
import API from '../api';
import EmployeeList from './EmployeeList';

function AdminDashboard({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsRes, employeesRes] = await Promise.all([
          API.get('/admin/leave-requests'),
          API.get('/admin/employees')
        ]);
        setRequests(requestsRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateLeaveDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const timeDiff = Math.abs(toDate - fromDate);
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
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
      setRequests(data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process leave');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/employees', newEmployee);
      const employeesRes = await API.get('/admin/employees');
      setEmployees(employeesRes.data);
      setShowEmployeeForm(false);
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        role: 'employee'
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await API.delete(`/admin/employees/${employeeId}`);
        const employeesRes = await API.get('/admin/employees');
        setEmployees(employeesRes.data);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete employee');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center self-start md:self-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave Requests</h2>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map(req => {
                    const numDays = calculateLeaveDays(req.from_date, req.to_date);
                    return (
                      <div key={req.leave_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              <span className="font-semibold">{req.employee_name}</span> 
                              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                {req.leave_type}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(req.from_date).toLocaleDateString()} → {new Date(req.to_date).toLocaleDateString()}
                              <span className="ml-2 font-medium text-gray-800">
                                ({numDays} day{numDays > 1 ? 's' : ''})
                              </span>
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {req.status}
                              </span>
                            </div>
                          </div>
                          {req.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAction(req.leave_id, 'approve')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(req.leave_id, 'reject')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests</h3>
                  <p className="mt-1 text-sm text-gray-500">All caught up! No pending leave requests.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Employee Management</h2>
                <button
                  onClick={() => setShowEmployeeForm(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg text-sm font-medium shadow hover:shadow-md transition-all duration-300 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Employee
                </button>
              </div>
              <EmployeeList employees={employees} onDelete={handleDeleteEmployee} />
            </div>
          </div>
        </div>
      </div>

      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Add New Employee</h3>
                <button
                  onClick={() => setShowEmployeeForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    value={newEmployee.email}
                    onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={newEmployee.password}
                    onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={newEmployee.role}
                    onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmployeeForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;