import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between h-16 px-8 bg-white shadow-sm border-b border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, <span className="text-teal-600 font-bold">{user?.name}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;