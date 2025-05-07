import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { joinCommunity } from "../../../api/communities.api";

const useJoinCommunity = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) => joinCommunity(initData, communityId),
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ["/communities", initData] });
      queryClient.invalidateQueries({
        queryKey: [`/communities/${communityId}`, initData],
      });
    },
  });
};

export default useJoinCommunity;
