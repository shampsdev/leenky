import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../stores/InitData.store";
import { joinMe } from "../api/api";

const useJoinMe = () => {
  const queryClient = useQueryClient();
  const { initData } = useInitDataStore();

  return useMutation({
    mutationFn: (chatId: string) => joinMe(initData, chatId),
    onSuccess: async (_, chatId) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "chats/preview",
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: [`chat/${chatId}`, chatId] });
      queryClient.invalidateQueries({
        queryKey: [`chat/${chatId}/preview`, initData, chatId],
      });
    },
  });
};

export default useJoinMe;
