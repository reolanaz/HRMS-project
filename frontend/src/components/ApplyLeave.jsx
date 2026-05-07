import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

// Leave policy config
const LEAVE_POLICY = {
  Sick:    { total: 10, maxConsecutive: 3, noticeDays: 0,  color: "blue"   },
  Casual:  { total: 12, maxConsecutive: 3, noticeDays: 1,  color: "green"  },
  Annual:  { total: 15, maxConsecutive: 15, noticeDays: 7, color: "purple" }
};

const ApplyLeave = () => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({
    Sick: 10, Casual: 12, Annual: 15
  });
  const [formData, setFormData] = useState({
    leaveType: 'Sick',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [calculatedDays, setCalculatedDays] = useState(0);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Calculate days whenever dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        setCalculatedDays(days);
      } else {
        setCalculatedDays(0);
      }
    }
  }, [formData.startDate, formData.endDate]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const employees = response.data.employees || [];
      const employee = employees.find(
        emp => emp.userId._id.toString() === user._id.toString()
      );

      if (employee) {
        setEmployeeId(employee._id);
        await fetchLeaveBalance(employee._id);
      } else {
        setMessage({ type: 'error', text: 'Employee record not found. Contact admin.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load employee data.' });
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchLeaveBalance = async (empId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaves', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const allLeaves = response.data.leaves || [];
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);

      const myLeaves = allLeaves.filter(
        l => l.employeeId?._id?.toString() === empId.toString() &&
             new Date(l.startDate) >= startOfYear &&
             l.status !== "Rejected"
      );

      const used = { Sick: 0, Casual: 0, Annual: 0 };
      myLeaves.forEach(l => {
        if (used[l.leaveType] !== undefined) {
          used[l.leaveType] += l.days;
        }
      });

      setLeaveBalance({
        Sick:   Math.max(0, 10 - used.Sick),
        Casual: Math.max(0, 12 - used.Casual),
        Annual: Math.max(0, 15 - used.Annual)
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const policy = LEAVE_POLICY[formData.leaveType];
    const noticeDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      return "Please fill in all fields";
    }

    if (formData.reason.trim().length < 10) {
      return "Reason must be at least 10 characters long";
    }

    if (start < today) {
      return "Cannot apply for leave on past dates";
    }

    if (end < start) {
      return "End date must be after start date";
    }

    if (formData.leaveType === "Casual" && noticeDays < 1) {
      return "Casual Leave requires at least 1 day advance notice";
    }

    if (formData.leaveType === "Annual" && noticeDays < 7) {
      return "Annual Leave requires at least 7 days advance notice";
    }

    if (calculatedDays > policy.maxConsecutive) {
      return `${formData.leaveType} Leave cannot exceed ${policy.maxConsecutive} consecutive days`;
    }

    if (calculatedDays > leaveBalance[formData.leaveType]) {
      return `Insufficient leave balance. You only have ${leaveBalance[formData.leaveType]} ${formData.leaveType} leave days remaining`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    if (!employeeId) {
      setMessage({ type: 'error', text: 'Employee ID not found' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/leaves/apply',
        {
          employeeId,
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setFormData({ leaveType: 'Sick', startDate: '', endDate: '', reason: '' });
        setCalculatedDays(0);
        // Refresh balance
        await fetchLeaveBalance(employeeId);
      }

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit leave application'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Apply for Leave</h2>
        <p className="text-gray-600 mt-1">Submit your leave request</p>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(leaveBalance).map(([type, remaining]) => {
          const total = LEAVE_POLICY[type].total;
          const used = total - remaining;
          const percentage = (remaining / total) * 100;
          const colors = {
            Sick:   { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   bar: "bg-blue-500"   },
            Casual: { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  bar: "bg-green-500"  },
            Annual: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", bar: "bg-purple-500" }
          };
          const c = colors[type];

          return (
            <div key={type} className={`${c.bg} ${c.border} border rounded-xl p-4`}>
              <div className="flex justify-between items-center mb-2">
                <p className={`font-semibold ${c.text}`}>{type} Leave</p>
                <span className={`text-xs px-2 py-1 rounded-full ${c.bg} ${c.text} font-bold border ${c.border}`}>
                  {remaining}/{total} days
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`${c.bar} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{used} used · {remaining} remaining</p>
            </div>
          );
        })}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit}>

          {/* Leave Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type *
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="Sick">Sick Leave ({leaveBalance.Sick} days left)</option>
              <option value="Casual">Casual Leave ({leaveBalance.Casual} days left)</option>
              <option value="Annual">Annual Leave ({leaveBalance.Annual} days left)</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Days Preview */}
          {calculatedDays > 0 && (
            <div className={`mb-6 p-3 rounded-lg border flex items-center gap-2 ${
              calculatedDays > leaveBalance[formData.leaveType]
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }`}>
              <span className="font-bold text-lg">{calculatedDays}</span>
              <span>day(s) selected</span>
              {calculatedDays > leaveBalance[formData.leaveType] && (
                <span className="ml-auto text-sm font-medium">
                  ⚠️ Exceeds balance!
                </span>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason * <span className="text-xs text-gray-400">(minimum 10 characters)</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              placeholder="Please provide a detailed reason for your leave..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.reason.length}/10 minimum characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !employeeId}
              className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 ${
                loading || !employeeId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ leaveType: 'Sick', startDate: '', endDate: '', reason: '' });
                setCalculatedDays(0);
                setMessage({ type: '', text: '' });
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Leave Policy Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
        <h3 className="font-semibold text-blue-900 mb-3">📋 Leave Policy</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-800 mb-1">🤒 Sick Leave</p>
            <p className="text-blue-700">• 10 days/year</p>
            <p className="text-blue-700">• Max 3 days at once</p>
            <p className="text-blue-700">• Same day apply allowed</p>
          </div>
          <div>
            <p className="font-semibold text-blue-800 mb-1">😊 Casual Leave</p>
            <p className="text-blue-700">• 12 days/year</p>
            <p className="text-blue-700">• Max 3 days at once</p>
            <p className="text-blue-700">• 1 day advance notice</p>
          </div>
          <div>
            <p className="font-semibold text-blue-800 mb-1">🏖️ Annual Leave</p>
            <p className="text-blue-700">• 15 days/year</p>
            <p className="text-blue-700">• Max 15 days at once</p>
            <p className="text-blue-700">• 7 days advance notice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;