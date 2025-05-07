import { Navigate, Outlet } from "react-router-dom";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
const ProtectedRoute = () => {
  const { isPending, data } = useGetMe();
  if (isPending) {
    return null;
  }

  if (!data) {
    return <Navigate to="/about/1" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
