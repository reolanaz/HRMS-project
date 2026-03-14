import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoutes = ({ allowedRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;