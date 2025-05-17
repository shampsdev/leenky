import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { setCommunityAvatar } from "../../../api/communities.api";

const useSetCommunityAvatar = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communityId,
      avatar,
    }: {
      communityId: string;
      avatar: File;
    }) => setCommunityAvatar(initData, communityId, avatar),
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

export default useSetCommunityAvatar;
