import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCommunity } from "../../../api/communities.api";
import { PatchCommunity } from "../../../types/postApiTypes/patchCommunity.interface";
import { fieldsToFieldValues } from "../../../mappers/FieldValues";
import useInitDataStore from "../../../stores/InitData.store";
import useUserStore from "../../../stores/user.store";
import usePatchMember from "../../members/mutations/usePatchMember";

const usePatchCommunity = () => {
  const patchMemberMutation = usePatchMember();
  const { initData } = useInitDataStore();
  const { userData } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityData }: { communityData: PatchCommunity }) =>
      patchCommunity(initData, communityData),
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

export default usePatchCommunity;
