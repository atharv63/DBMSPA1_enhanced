import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RemainingLeaveBalance() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/leave-balance-summary-report')
      .then(res => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leave balance summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Remaining Leave Balance</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Sick Leave Taken</th>
            <th>Sick Remaining</th>
            <th>Casual Leave Taken</th>
            <th>Casual Remaining</th>
            <th>Paid Leave Taken</th>
            <th>Paid Remaining</th>
            <th>Maternity Leave Taken</th>
            <th>Maternity Remaining</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row, index) => (
            <tr key={index}>
              <td>{row.employee_name}</td>
              <td>{row.sick_leave}</td>
              <td>{row.sick_remaining}</td>
              <td>{row.casual_leave}</td>
              <td>{row.casual_remaining}</td>
              <td>{row.paid_leave}</td>
              <td>{row.paid_remaining}</td>
              <td>{row.maternity_leave}</td>
              <td>{row.maternity_remaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemainingLeaveBalance;
