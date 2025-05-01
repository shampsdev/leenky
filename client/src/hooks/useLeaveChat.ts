import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveChat } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useLeaveChat = () => {
  const { initData } = useInitDataStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => leaveChat(initData, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chats/preview"] });
    },
  });
};

export default useLeaveChat;
