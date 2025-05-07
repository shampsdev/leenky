import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { leaveCommunity } from "../../../api/communities.api";
import { Community } from "../../../types/community/community.interface";

const useLeaveCommunity = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) => leaveCommunity(initData, communityId),
    onSuccess: (_, communityId) => {
      queryClient.setQueryData<Community[]>(
        ["/communities", initData],
        (old) => old?.filter((community) => community.id !== communityId) ?? [],
      );

      queryClient.setQueriesData(
        { queryKey: ["/communities", initData] },
        (old: Community[] | undefined) =>
          old?.filter((community) => community.id !== communityId) ?? [],
      );

      queryClient.setQueryData(
        [`/communities/${communityId}`, initData, communityId],
        null,
      );
    },
  });
};

export default useLeaveCommunity;
