import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../stores/InitData.store";
import { joinMe } from "../api/api";

const useJoinMe = () => {
  const queryClient = useQueryClient();
  const { initData } = useInitDataStore();

  return useMutation({
    mutationFn: (chatId: string) => joinMe(initData, chatId),
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: [`chat/${chatId}`, chatId] });
      queryClient.invalidateQueries({
        queryKey: [`chat/${chatId}/preview`, initData, chatId],
      });
    },
  });
};

export default useJoinMe;
