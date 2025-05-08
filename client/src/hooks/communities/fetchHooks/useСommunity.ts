import { useQuery } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { getCommunity } from "../../../api/communities.api";

const useCommunity = (id: string) => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: [`/communities/${id}`, initData],
    queryFn: () => getCommunity(initData, id),
  });
};

export default useCommunity;
