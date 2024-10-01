import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";
import CommonLayout from "../pages/CommonLayout";

const AdminProtectedRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (token && !user) {
    return <div>Loading...</div>; // Optional loading state
  }

  return user && user.type === "admin" ? (
    <CommonLayout />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

export default AdminProtectedRoute;
