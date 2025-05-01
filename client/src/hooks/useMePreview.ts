import { useQuery } from "@tanstack/react-query";
import useInitDataStore from "../stores/InitData.store";
import { getMePreview } from "../api/api";

const useMePreview = () => {
  const { initData } = useInitDataStore();
  return useQuery({
    queryKey: [`users/me/preview`, initData],
    queryFn: () => getMePreview(initData),
  });
};

export default useMePreview;
