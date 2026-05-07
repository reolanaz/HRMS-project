import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoutes = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  console.log("PrivateRoutes - user:", user);
  console.log("PrivateRoutes - allowedRoles:", allowedRoles);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoutes;