import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const EmployeeSummary = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [leaveStats, setLeaveStats] = useState({
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
    fetchLeaveStats();
  }, []);

  const fetchEmployeeData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/employees', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const employee = response.data.employees.find(
      emp => emp.userId._id.toString() === user._id.toString()
    );
    setEmployeeData(employee);
  } catch (error) {
    console.error('Error fetching employee data:', error);
  }
};

const fetchLeaveStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/leaves', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const allLeaves = response.data.leaves || [];

    const employeeLeaves = allLeaves.filter(
      leave => leave.employeeId?.userId?._id?.toString() === user._id.toString()
    );

    const stats = {
      totalLeaves: employeeLeaves.length,
      pendingLeaves: employeeLeaves.filter(l => l.status === 'Pending').length,
      approvedLeaves: employeeLeaves.filter(l => l.status === 'Approved').length,
      rejectedLeaves: employeeLeaves.filter(l => l.status === 'Rejected').length
    };

    setLeaveStats(stats);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching leave stats:', error);
    setLoading(false);
  }
};
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome back, {employeeData?.userId?.name || user.name}!
        </h2>
        <p className="text-gray-600 mt-2">Here's your overview for today</p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">{employeeData?.userId?.name}</h3>
            <p className="text-blue-100 mb-1">
              <span className="font-semibold">Employee ID:</span> {employeeData?.employeeId}
            </p>
            <p className="text-blue-100 mb-1">
              <span className="font-semibold">Designation:</span> {employeeData?.designation}
            </p>
            <p className="text-blue-100 mb-1">
              <span className="font-semibold">Department:</span> {employeeData?.department?.name}
            </p>
            <p className="text-blue-100">
              <span className="font-semibold">Email:</span> {employeeData?.userId?.email}
            </p>
          </div>
          <div className="text-center bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-4xl font-bold">₹{employeeData?.salary?.toLocaleString()}</div>
            <div className="text-sm text-blue-100 mt-1">Monthly Salary</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Applications</p>
              <h3 className="text-3xl font-bold text-gray-800">{leaveStats.totalLeaves}</h3>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">All time leave applications</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
              <h3 className="text-3xl font-bold text-gray-800">{leaveStats.pendingLeaves}</h3>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Awaiting approval</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
              <h3 className="text-3xl font-bold text-gray-800">{leaveStats.approvedLeaves}</h3>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Approved requests</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Rejected</p>
              <h3 className="text-3xl font-bold text-gray-800">{leaveStats.rejectedLeaves}</h3>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Declined requests</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/employee-dashboard/apply-leave'}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Apply for Leave
          </button>
          
          <button 
            onClick={() => window.location.href = '/employee-dashboard/leaves'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Leave History
          </button>
          
          <button 
            onClick={() => window.location.href = '/employee-dashboard/profile'}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm font-medium">Date of Birth</p>
            <p className="text-gray-800 font-semibold">
              {employeeData?.dob ? new Date(employeeData.dob).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Gender</p>
            <p className="text-gray-800 font-semibold">{employeeData?.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Marital Status</p>
            <p className="text-gray-800 font-semibold">{employeeData?.maritalStatus || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;