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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, employeesRes] = await Promise.all([
          API.get('/admin/leave-requests'),
          API.get('/admin/employees')
        ]);
        setRequests(requestsRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    fetchData();
  }, []);

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
      const { data } = await API.post('/admin/employees', newEmployee);
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>
          
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.leave_id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p><strong>{req.employee_name}</strong> ({req.leave_type})</p>
                      <p>From: {new Date(req.from_date).toLocaleDateString()} 
                         To: {new Date(req.to_date).toLocaleDateString()}</p>
                      <p>Status: <span className={`font-semibold ${
                        req.status === 'approved' ? 'text-green-600' : 
                        req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`}>{req.status}</span></p>
                    </div>
                    {req.status === 'pending' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAction(req.leave_id, 'approve')}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.leave_id, 'reject')}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No leave requests available.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Employee Management</h2>
            <button
              onClick={() => setShowEmployeeForm(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
          </div>
          
          <EmployeeList 
            employees={employees} 
            onDelete={handleDeleteEmployee} 
          />
        </div>
      </div>

      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
              <input
                type="email"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Email"
                value={newEmployee.email}
                onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
              <input
                type="password"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Password"
                value={newEmployee.password}
                onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
                required
              />
              <select
                className="w-full mb-4 p-2 border rounded"
                value={newEmployee.role}
                onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmployeeForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;