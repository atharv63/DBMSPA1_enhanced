import React, { useState } from 'react';

function ApplyLeaveModal({ balance, onClose, onSubmit }) {
  const [form, setForm] = useState({
    leave_type: 'sick', // default ENUM value
    from_date: '',
    to_date: '',
    reason: ''
  });
  const [error, setError] = useState('');

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.from_date || !form.to_date || !form.reason) {
      setError('All fields are required');
      return;
    }
    setError('');
    onSubmit(form);
  };

  // Get only leave type keys from the balance object
  const leaveTypes = Object.keys(balance || {}).filter(key => key.endsWith('_leave'));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}
        >
          Apply for Leave
        </h2>

        {error && (
          <p
            style={{
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Leave Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              Leave Type
            </label>
            <select
              name="leave_type"
              value={form.leave_type}
              onChange={handleChange}
              style={{
                marginTop: '0.25rem',
                width: '100%',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                padding: '0.5rem',
                fontSize: '1rem'
              }}
            >
              {leaveTypes.map((type) => {
                const shortType = type.replace('_leave', ''); // "sick_leave" -> "sick"
                return (
                  <option key={shortType} value={shortType}>
                    {shortType.charAt(0).toUpperCase() + shortType.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              From Date
            </label>
            <input
              type="date"
              name="from_date"
              value={form.from_date}
              onChange={handleChange}
              style={{
                marginTop: '0.25rem',
                width: '100%',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                padding: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* To Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              To Date
            </label>
            <input
              type="date"
              name="to_date"
              value={form.to_date}
              onChange={handleChange}
              style={{
                marginTop: '0.25rem',
                width: '100%',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                padding: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Reason */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              Reason
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              style={{
                marginTop: '0.25rem',
                width: '100%',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                padding: '0.5rem',
                fontSize: '1rem'
              }}
            ></textarea>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#e5e7eb',
                color: '#1f2937',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#4f46e5',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeaveModal;
