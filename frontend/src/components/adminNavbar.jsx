import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const adminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-[#F4F4F4] text-[#0C2B4E] shadow-md">
      <p className="text-lg font-semibold">
        Welcome, <span className="font-bold">{user?.name}</span>
      </p>
      <button
  onClick={handleLogout}
  className="bg-[#0C2B4E] text-white font-semibold px-5 py-1.5 rounded-md hover:bg-[#003d47] transition-all text-sm"
>
  Logout
</button>
    </div>
  );
};

export default adminNavbar;