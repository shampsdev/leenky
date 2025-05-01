import { useQuery } from "@tanstack/react-query";
import useInitDataStore from "../stores/InitData.store";
import { getMe } from "../api/api";

const useMe = () => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: ["user/me", initData],
    queryFn: () => getMe(initData),
  });
};

export default useMe;
