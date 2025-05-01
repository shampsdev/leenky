import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveChat } from "../api/api";
import useInitDataStore from "../stores/InitData.store";
import { ChatPreviewData } from "../types/user.interface";

const useLeaveChat = () => {
  const { initData } = useInitDataStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => leaveChat(initData, chatId),
    onSuccess: (_, chatId) => {
      queryClient.setQueryData<ChatPreviewData[]>(
        ["chats/preview", initData, ""],
        (old) => old?.filter((chat) => chat.id !== chatId) ?? [],
      );
    },
  });
};

export default useLeaveChat;
