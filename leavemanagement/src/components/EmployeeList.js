import React from 'react';

function EmployeeList({ employees, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border">{employee.name}</td>
              <td className="py-2 px-4 border">{employee.email}</td>
              <td className="py-2 px-4 border capitalize">{employee.role}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => onDelete(employee.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;