import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { createMe } from "../../../api/users.api";
import useUserStore from "../../../stores/user.store";

const useCreateMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();
  const userStore = useUserStore();
  return useMutation({
    mutationFn: () => createMe(initData),
    onSuccess: async (user) => {
      console.log("CREATED", user);
      if (user?.id) {
        userStore.setUserData(user);
      }
      const result = await queryClient.refetchQueries({
        queryKey: ["users/me", initData],
        type: "active",
        exact: true,
      });
    },
  });
};

export default useCreateMe;
