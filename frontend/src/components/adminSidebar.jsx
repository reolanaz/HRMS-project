import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  MdDashboard,
  MdPeople,
  MdApartment,
  MdEventNote,
  MdAttachMoney,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const navLinks = [
  { path: "/admin-dashboard",             icon: <MdDashboard size={20} />,   label: "Dashboard"   },
  { path: "/admin-dashboard/employees",   icon: <MdPeople size={20} />,      label: "Employees"   },
  { path: "/admin-dashboard/departments", icon: <MdApartment size={20} />,   label: "Departments" },
  { path: "/admin-dashboard/leaves",      icon: <MdEventNote size={20} />,   label: "Leaves"      },
  { path: "/admin-dashboard/salary",      icon: <MdAttachMoney size={20} />, label: "Salary"      },
  { path: "/admin-dashboard/settings",    icon: <MdSettings size={20} />,    label: "Settings"    },
];

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col w-64 min-h-screen bg-[#005461] text-white fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide text-white">
          Employee MS
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/admin-dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-teal-500 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <MdLogout size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;