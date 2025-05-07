import { useQuery } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { getCommunityPreview } from "../../../api/communities.api";

const useCommunityPreview = (id: string) => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: [`communities/${id}`, initData, id],
    queryFn: () => getCommunityPreview(initData, id),
  });
};

export default useCommunityPreview;
