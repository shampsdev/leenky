import { useQuery } from "@tanstack/react-query";
import { getChat } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useChat = (chatId: string) => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: [`chat/${chatId}`, initData, chatId],
    queryFn: () => getChat(initData, chatId),
  });
};

export default useChat;
