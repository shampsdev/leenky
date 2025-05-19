import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCommunity } from "../../../api/communities.api";
import { PatchCommunity } from "../../../types/postApiTypes/patchCommunity.interface";
import useInitDataStore from "../../../stores/InitData.store";

const usePatchCommunity = () => {
  const { initData } = useInitDataStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityData }: { communityData: PatchCommunity }) =>
      patchCommunity(initData, communityData),
    onSuccess: async (community) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/communities", initData] }),
        queryClient.refetchQueries({
          queryKey: [`/communities/${community?.id}`, initData],
        }),
      ]);
    },
  });
};

export default usePatchCommunity;
