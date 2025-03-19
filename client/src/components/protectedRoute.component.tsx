import useUserStore from "../stores/user.store";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useUserStore();
  if (isLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/about/1" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
