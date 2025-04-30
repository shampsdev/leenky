import useMe from "../hooks/useMe";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const { isPending, data } = useMe();

  if (isPending) {
    return null;
  }

  if (!data?.isRegistered) {
    return <Navigate to="/about/1" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
