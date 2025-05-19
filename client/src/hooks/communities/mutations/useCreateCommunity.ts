import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { createCommunity } from "../../../api/communities.api";
import { CreateCommunity } from "../../../types/postApiTypes/createCommunity.interface";
import useUserStore from "../../../stores/user.store";
import { fieldsToFieldValues } from "../../../mappers/FieldValues";
import usePatchMember from "../../members/mutations/usePatchMember";

const useCreateCommunity = () => {
  const patchMemberMutation = usePatchMember();
  const { initData } = useInitDataStore();
  const { userData } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityData }: { communityData: CreateCommunity }) =>
      createCommunity(initData, communityData),
    onSuccess: async (community) => {
      await patchMemberMutation.mutateAsync({
        communityId: community?.id || "",
        memberId: userData.id,
        newData: {
          config: {
            fields: fieldsToFieldValues(community?.config.fields ?? []),
          },
          id: "",
          isAdmin: true,
          userId: userData.id,
        },
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/communities", initData] }),
        queryClient.refetchQueries({
          queryKey: [`/communities/${community?.id}`, initData],
        }),
      ]);
    },
  });
};

export default useCreateCommunity;
