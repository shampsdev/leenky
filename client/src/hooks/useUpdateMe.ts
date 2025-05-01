import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createMe, postMe } from "../api/api";
import useInitDataStore from "../stores/InitData.store";
import { UserData } from "../types/user.interface";

const useUpdateMe = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      profileData: Pick<
        UserData,
        "firstName" | "lastName" | "bio" | "role" | "company"
      >,
    ) => postMe(initData, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user/me", initData] });
      queryClient.invalidateQueries({
        queryKey: ["user/me/preview", initData],
      });
    },
  });
};

export default useUpdateMe;
