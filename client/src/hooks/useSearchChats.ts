import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchChats } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useSearchChats = (query: string) => {
  const { initData } = useInitDataStore();

  return useQuery({
    queryKey: ["chats/preview", initData, query],
    queryFn: () => searchChats(initData, query),
    placeholderData: keepPreviousData,
  });
};

export default useSearchChats;
