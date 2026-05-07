import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const EmployeeSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-16 flex items-center justify-center">
        <h3 className="text-2xl font-bold">Employee Portal</h3>
      </div>

      <div className="px-4 py-3 bg-gray-700">
        <p className="text-sm text-gray-300">Welcome</p>
        <p className="font-semibold text-lg">{user?.name}</p>
        <p className="text-xs text-teal-400 capitalize">{user?.role}</p>
      </div>

      <div className="px-4 py-2 space-y-1">
        <NavLink
          to="/employee-dashboard"
          end
          className={({ isActive }) =>
            `${
              isActive ? 'bg-teal-600' : 'bg-gray-800'
            } flex items-center gap-3 px-4 py-3 rounded hover:bg-teal-600 transition-all duration-200`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/employee-dashboard/apply-leave"
          className={({ isActive }) =>
            `${
              isActive ? 'bg-teal-600' : 'bg-gray-800'
            } flex items-center gap-3 px-4 py-3 rounded hover:bg-teal-600 transition-all duration-200`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Apply Leave
        </NavLink>

        <NavLink
          to="/employee-dashboard/leaves"
          className={({ isActive }) =>
            `${
              isActive ? 'bg-teal-600' : 'bg-gray-800'
            } flex items-center gap-3 px-4 py-3 rounded hover:bg-teal-600 transition-all duration-200`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Leave History
        </NavLink>

        <NavLink
          to="/employee-dashboard/profile"
          className={({ isActive }) =>
            `${
              isActive ? 'bg-teal-600' : 'bg-gray-800'
            } flex items-center gap-3 px-4 py-3 rounded hover:bg-teal-600 transition-all duration-200`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </NavLink>

        <NavLink
          to="/employee-dashboard/settings"
          className={({ isActive }) =>
            `${
              isActive ? 'bg-teal-600' : 'bg-gray-800'
            } flex items-center gap-3 px-4 py-3 rounded hover:bg-teal-600 transition-all duration-200`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </NavLink>
        <NavLink
              to="/employee-dashboard/payslip"
              className={({ isActive }) =>
                 `${isActive ? 'bg-teal-600' : 'bg-gray-800'}
                 flex items-center gap-3 px-4 py-3 rounded hover:bg-teal-600 transition-all duration-200`
           }
>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
              Pay Slip
       </NavLink>
      </div>

      <div className="absolute bottom-0 w-64 px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;