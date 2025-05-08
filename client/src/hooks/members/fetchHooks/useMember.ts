import { useQuery } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { getMember } from "../../../api/communities.api";

const useMember = (communityId: string, memberId: string) => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryFn: () => getMember(initData, communityId, memberId),
    queryKey: [
      `/communities/${communityId}/member/${memberId}`,
      initData,
      communityId,
      memberId,
    ],
  });
};

export default useMember;
