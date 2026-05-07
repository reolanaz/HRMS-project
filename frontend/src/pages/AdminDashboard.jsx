import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/adminSidebar';
import AdminNavbar from '../components/adminNavbar';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <AdminNavbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;