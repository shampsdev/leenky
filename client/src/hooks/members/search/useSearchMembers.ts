import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { searchMembers } from "../../../api/communities.api";

const useSearchMembers = (communityId: string, query: string) => {
  const { initData } = useInitDataStore();

  return useQuery({
    queryFn: () => searchMembers(initData, communityId, query),
    queryKey: [
      `/communities/${communityId}/members`,
      initData,
      communityId,
      query,
    ],
    placeholderData: keepPreviousData,
  });
};

export default useSearchMembers;
