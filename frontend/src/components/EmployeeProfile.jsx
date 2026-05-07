import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
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

  if (!employeeData) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">
          Employee data not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-600 mt-1">View your personal and professional information</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg p-8 mb-6 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-teal-600 text-4xl font-bold shadow-lg">
            {employeeData.userId.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-2">{employeeData.userId.name}</h3>
            <p className="text-blue-100 text-lg mb-1">{employeeData.designation}</p>
            <p className="text-blue-100">{employeeData.department.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Employee ID</p>
            <p className="text-2xl font-bold">{employeeData.employeeId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg text-gray-800 font-semibold">{employeeData.userId.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-800">{employeeData.userId.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-lg text-gray-800">
                {employeeData.dob ? new Date(employeeData.dob).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-lg text-gray-800">{employeeData.gender || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Marital Status</p>
              <p className="text-lg text-gray-800">{employeeData.maritalStatus || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Employee ID</p>
              <p className="text-lg text-gray-800 font-semibold">{employeeData.employeeId}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Designation</p>
              <p className="text-lg text-gray-800">{employeeData.designation}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-lg text-gray-800">{employeeData.department.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Salary</p>
              <p className="text-2xl text-teal-600 font-bold">₹{employeeData.salary.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-lg text-gray-800 capitalize">{employeeData.userId.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg">
          Update Profile
        </button>
        <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200">
          Download Info
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfile;