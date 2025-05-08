import { useQuery } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { getMe } from "../../../api/users.api";

const useGetMe = () => {
  const { initData } = useInitDataStore();

  return useQuery({
    queryFn: () => getMe(initData),
    queryKey: [`users/me`, initData],
  });
};

export default useGetMe;
