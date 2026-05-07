import React from 'react';

const TestDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-blue-900 text-white fixed left-0 top-0">
        <div className="p-4">
          <h1 className="text-xl font-bold">SIDEBAR TEST</h1>
          <p className="mt-4">If you see this, sidebar works!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        {/* Navbar */}
        <div className="h-16 bg-red-500 text-white flex items-center px-6">
          <h2 className="text-xl font-bold">NAVBAR TEST</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">CONTENT AREA</h1>
          <p>If you see sidebar (blue) and navbar (red), the layout works!</p>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;