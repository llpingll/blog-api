import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";

const AdminLayout = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (token && !user) {
    return <div>Loading...</div>; // Optional loading state
  }

  return user && user.type === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

export default AdminLayout;
