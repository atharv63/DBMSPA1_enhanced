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

      await onSubmit({
        leave_type: form.leave_type,
        from_date: form.from_date,
        to_date: form.to_date,
        reason: form.reason,
        days
      });

      onClose();
    } catch (err) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Apply for Leave</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                name="leave_type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="from_date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={form.from_date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="to_date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={form.to_date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                name="reason"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows="3"
                placeholder="Briefly explain the reason for your leave"
                value={form.reason}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-24"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : 'Apply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeaveModal;