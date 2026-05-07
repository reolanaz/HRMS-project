import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const EmployeeLeaveHistory = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaves', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Filter leaves for current employee
      const allLeaves = response.data.leaves || [];
const employeeLeaves = allLeaves.filter(
  leave => leave.employeeId?.userId?._id?.toString() === user._id.toString()
);

      setLeaves(employeeLeaves);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredLeaves = filter === 'All' 
    ? leaves 
    : leaves.filter(leave => leave.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Leave History</h2>
        <p className="text-gray-600 mt-1">Track all your leave applications</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === status
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status} ({status === 'All' ? leaves.length : leaves.filter(l => l.status === status).length})
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Leave Applications</h3>
          <p className="text-gray-500">You haven't applied for any leave yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLeaves.map((leave) => (
            <div key={leave._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{leave.leaveType} Leave</h3>
                  <p className="text-sm text-gray-500">
                    Applied: {new Date(leave.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                  {leave.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{leave.days} day(s)</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                <p className="text-sm text-gray-600">{leave.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;