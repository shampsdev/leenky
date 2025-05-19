import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import useUserStore from "../stores/user.store";
import Loader from "../components/loader.component";

const ProtectedRoute = () => {
  const userStore = useUserStore();
  const { isPending, isLoading, isSuccess, isError, data } = useGetMe();

  useEffect(() => {
    if (isSuccess && data) {
      console.log("✅ Данные получены:", data);
      userStore.setUserData(data.user);
    }
  }, [isSuccess, data]);

  console.log({
    isPending,
    isLoading,
    isSuccess,
    isError,
    data,
    userStore: userStore.userData,
  });

  if (isPending || isLoading) return <Loader />;
  else if (data?.user?.id) return <Outlet />;
  else return <Navigate to="/about/1" />;
};

export default ProtectedRoute;
