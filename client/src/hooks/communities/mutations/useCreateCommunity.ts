import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { createCommunity, joinCommunity } from "../../../api/communities.api";
import { CreateCommunity } from "../../../types/postApiTypes/createCommunity.interface";

const useCreateCommunity = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityData }: { communityData: CreateCommunity }) =>
      createCommunity(initData, communityData),
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

export default useCreateCommunity;
