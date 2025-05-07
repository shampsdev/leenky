import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { deleteMe } from "../../../api/users.api";

const useDeleteMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMe(initData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me", initData] });
    },
  });
};

export default useDeleteMe;
