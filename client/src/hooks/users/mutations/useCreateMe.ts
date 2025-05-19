import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { createMe } from "../../../api/users.api";

const useCreateMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createMe(initData),
    onSuccess: async () => {
      const result = await queryClient.refetchQueries({
        queryKey: ["users/me", initData],
        type: "active",
        exact: true,
      });
      console.log("RESULT:", result);
    },
  });
};

export default useCreateMe;
