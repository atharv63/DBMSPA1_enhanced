import React from 'react';

function LeaveHistory({ leaves }) {
  if (!leaves || leaves.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <svg
          style={{ margin: '0 auto', height: '3rem', width: '3rem', color: '#9ca3af' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
          No leave history
        </h3>
        <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
          You haven't applied for any leaves yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f9fafb' }}>
          <tr>
            {['Type', 'From', 'To', 'Days', 'Reason', 'Status'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: '#ffffff' }}>
          {leaves.map((leave, index) => (
            <tr
              key={index}
              style={{
                transition: 'background-color 0.15s',
                borderBottom: '1px solid #f3f4f6'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{leave.leave_type}</td>
              <td style={{ padding: '1rem 1.5rem' }}>{new Date(leave.from_date).toLocaleDateString()}</td>
              <td style={{ padding: '1rem 1.5rem' }}>{new Date(leave.to_date).toLocaleDateString()}</td>
              <td style={{ padding: '1rem 1.5rem' }}>
                {Math.ceil((new Date(leave.to_date) - new Date(leave.from_date)) / (1000 * 60 * 60 * 24)) + 1}
              </td>
              <td style={{ padding: '1rem 1.5rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {leave.reason}
              </td>
              <td style={{ padding: '1rem 1.5rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '9999px',
                    backgroundColor:
                      leave.status === 'approved'
                        ? '#d1fae5'
                        : leave.status === 'rejected'
                        ? '#fee2e2'
                        : '#fef3c7',
                    color:
                      leave.status === 'approved'
                        ? '#065f46'
                        : leave.status === 'rejected'
                        ? '#991b1b'
                        : '#92400e'
                  }}
                >
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