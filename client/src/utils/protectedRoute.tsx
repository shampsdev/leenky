import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import useUserStore from "../stores/user.store";

const ProtectedRoute = () => {
  const userStore = useUserStore();
  const { isPending, data, isSuccess, isError } = useGetMe();

  useEffect(() => {
    if (isSuccess && data) {
      userStore.setUserData(data.user);
    }
  }, [isSuccess, data]);

  if (isPending) return null;

  if (data?.user.id) return <Outlet />;
  else return <Navigate to="/about/1" />;

  // if (!data?.user) return <Navigate to="/about/1" />
  // else  (isSuccess) return <Outlet />;
};

export default ProtectedRoute;
