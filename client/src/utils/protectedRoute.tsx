import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import useUserStore from "../stores/user.store";
import Loader from "../components/loader.component";

const ProtectedRoute = () => {
  const userStore = useUserStore();
  const { isPending, isLoading, isSuccess, data } = useGetMe();

  useEffect(() => {
    if (isSuccess && data) {
      userStore.setUserData(data.user);
    }
  }, [isSuccess, data]);

  if (isPending || isLoading) return <Loader />;
  else if (data?.user?.id || isSuccess) return <Outlet />;
  else return <Navigate to="/about/1" />;
};

export default ProtectedRoute;
