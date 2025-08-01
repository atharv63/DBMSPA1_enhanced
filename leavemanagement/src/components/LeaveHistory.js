import React from 'react';

function LeaveHistory({ leaves }) {
  if (!leaves || leaves.length === 0) {
    return <p>No leave history found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Type</th>
            <th className="py-2 px-4 border">From</th>
            <th className="py-2 px-4 border">To</th>
            <th className="py-2 px-4 border">Days</th>
            <th className="py-2 px-4 border">Reason</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border capitalize">{leave.leave_type}</td>
              <td className="py-2 px-4 border">{new Date(leave.from_date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border">{new Date(leave.to_date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border">
                {Math.ceil((new Date(leave.to_date) - new Date(leave.from_date)) / (1000 * 60 * 60 * 24)) + 1}
              </td>
              <td className="py-2 px-4 border">{leave.reason}</td>
              <td className="py-2 px-4 border">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                  leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {leave.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveHistory;