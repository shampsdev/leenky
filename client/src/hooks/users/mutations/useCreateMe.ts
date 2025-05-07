import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { createMe } from "../../../api/users.api";

const useCreateMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createMe(initData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me", initData] });
    },
  });
};

export default useCreateMe;
