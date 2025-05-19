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
    onSuccess: async (_, communityId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/communities", initData] }),
        queryClient.refetchQueries({
          queryKey: [`/communities/${communityId}`, initData],
        }),
      ]);
    },
  });
};

export default useJoinCommunity;
