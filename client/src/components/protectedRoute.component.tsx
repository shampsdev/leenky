import { Navigate, Outlet } from "react-router-dom";
import useMePreview from "../hooks/useMePreview";
const ProtectedRoute = () => {
  const { isPending, data } = useMePreview();
  if (isPending) {
    return null;
  }
  if (!data?.isRegistered) {
    return <Navigate to="/about/1" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
