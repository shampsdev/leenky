import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../stores/InitData.store";
import { createMe } from "../api/api";
import { UserData } from "../types/user.interface";

const useCreateMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      profileData: Pick<
        UserData,
        "firstName" | "lastName" | "bio" | "role" | "company"
      >,
    ) => createMe(initData, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user/me", initData] });
      queryClient.invalidateQueries({
        queryKey: ["user/me/preview", initData],
      });
    },
  });
};

export default useCreateMe;
