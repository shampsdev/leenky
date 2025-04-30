import { useQuery } from "@tanstack/react-query";
import { getChatPreview } from "../api/api";
import useInitDataStore from "../stores/InitData.store";

const useChatPreview = (chatId: string) => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: [`chat/${chatId}/preview`, initData, chatId],
    queryFn: () => getChatPreview(initData, chatId),
  });
};

export default useChatPreview;
