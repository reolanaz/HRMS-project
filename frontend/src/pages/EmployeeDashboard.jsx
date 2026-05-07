import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/employeeSidebar';
import EmployeeNavbar from '../components/employeeNavbar';

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <EmployeeSidebar />
      
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <EmployeeNavbar />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;