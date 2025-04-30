import { useQuery } from "@tanstack/react-query";
import { getChats } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useChats = () => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: ["chats", initData],
    queryFn: () => getChats(initData),
  });
};

export default useChats;
