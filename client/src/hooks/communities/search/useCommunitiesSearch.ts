import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { searchCommunities } from "../../../api/communities.api";

const useCommunitiesSearch = (query: string) => {
  const { initData } = useInitDataStore();

  return useQuery({
    queryKey: ["/communities", initData, query],
    queryFn: () => searchCommunities(initData, query),
    placeholderData: keepPreviousData,
  });
};

export default useCommunitiesSearch;
