import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { joinCommunity } from "../../../api/communities.api";
import { MemberConfig } from "../../../types/member/memberConfig.interface";

const useJoinCommunity = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communityId,
      memberConfig,
    }: {
      communityId: string;
      memberConfig: MemberConfig;
    }) => joinCommunity(initData, communityId, memberConfig),
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ["/communities", initData] });
      queryClient.invalidateQueries({
        queryKey: [`/communities/${communityId}`, initData],
      });
    },
  });
};

export default useJoinCommunity;
