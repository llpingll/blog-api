import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";
import CommonLayout from "../pages/CommonLayout";
import Loader from "./Loader";

const AdminProtectedRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (token && !user) {
    return <Loader />;
  }

  return user && user.type === "admin" ? (
    <CommonLayout />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

export default AdminProtectedRoute;
