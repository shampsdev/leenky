import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { PatchMe } from "../../../types/postApiTypes/patchMe.interface";
import { updateMe } from "../../../api/users.api";

const useUpdateMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newData: PatchMe) => updateMe(initData, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me", initData] });
    },
  });
};

export default useUpdateMe;
