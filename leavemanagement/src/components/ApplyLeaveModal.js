import React, { useState } from 'react';

function ApplyLeaveModal({ balance, onClose, onSubmit }) {
  const [form, setForm] = useState({
    leave_type: 'sick',
    from_date: '',
    to_date: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Frontend validation
      if (!form.from_date || !form.to_date || !form.reason) {
        throw new Error('All fields are required');
      }

      const fromDate = new Date(`${form.from_date}T00:00:00`);
      const toDate = new Date(`${form.to_date}T00:00:00`);

      if (fromDate.getTime() > toDate.getTime()) {
        throw new Error('From date cannot be after to date');
      }

      const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      let remaining;
      switch (form.leave_type) {
        case 'sick':
          remaining = balance?.sick_leave || 0;
          break;
        case 'casual':
          remaining = balance?.casual_leave || 0;
          break;
        case 'paid':
          remaining = balance?.paid_leave || 0;
          break;
        case 'maternity':
          remaining = balance?.maternity_leave || 0;
          break;
        default:
          remaining = 0;
      }

      if (days > remaining) {
        throw new Error(
          `Insufficient ${form.leave_type} leave balance. Available: ${remaining}, Requested: ${days}`
        );
      }

      // Optional test log (uncomment if needed)
      // console.log('Submitting leave request:', form, 'Days:', days);
      // setError(`Ready to submit: ${days} days of ${form.leave_type}. Available: ${remaining}`);
      // return;

      // Submit to backend
      await onSubmit({
        leave_type: form.leave_type,
        from_date: form.from_date,
        to_date: form.to_date,
        reason: form.reason,
        days
      });

      onClose();
    } catch (err) {
      console.error('Leave submission error:', err);

      // Check if backend returned an error (e.g., from Axios)
      const backendMessage =
        err?.response?.data?.error || err?.message || String(err);

      setError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Apply for Leave</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Leave Type</label>
            <select
              name="leave_type"
              className="w-full p-2 border rounded"
              value={form.leave_type}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="paid">Paid Leave</option>
              <option value="maternity">Maternity Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                name="from_date"
                className="w-full p-2 border rounded"
                value={form.from_date}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                name="to_date"
                className="w-full p-2 border rounded"
                value={form.to_date}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reason</label>
            <textarea
              name="reason"
              className="w-full p-2 border rounded"
              rows="3"
              value={form.reason}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeaveModal;
