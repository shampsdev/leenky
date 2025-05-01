import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchInChat } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useSearchUsersInChat = (chatId: string, query: string) => {
  const { initData } = useInitDataStore();

  return useQuery({
    queryKey: [`chat/${chatId}`, initData, chatId, query],
    queryFn: () => searchInChat(initData, chatId, query),
    placeholderData: keepPreviousData,
  });
};

export default useSearchUsersInChat;
