import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useUser = (userId: string) => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: [`user/${userId}`, initData, userId],
    queryFn: () => getUserById(initData, userId),
  });
};

export default useUser;
