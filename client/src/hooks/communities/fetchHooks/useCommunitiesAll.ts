import { useQuery, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { getCommunityPreviews } from "../../../api/communities.api";
import { Community } from "../../../types/community/community.interface";

const useCommunititesAll = () => {
  const { initData } = useInitDataStore();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [`communities/`, initData],
    queryFn: async () => {
      const communities = await getCommunityPreviews(initData);

      communities?.forEach((community: Community) => {
        queryClient.setQueryData(
          [`communities/${community.id}`, initData, community.id],
          community,
        );
      });

      return communities;
    },
  });
};

export default useCommunititesAll;
