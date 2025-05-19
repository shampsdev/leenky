import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInitDataStore from "../../../stores/InitData.store";
import { patchMember } from "../../../api/communities.api";
import { PatchMember } from "../../../types/member/patchMember.interface";

export interface PatchMemberArgs {
  communityId: string;
  memberId: string;
  newData: PatchMember;
}

const usePatchMember = () => {
  const { initData } = useInitDataStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityId, memberId, newData }: PatchMemberArgs) =>
      patchMember(initData, communityId, memberId, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me", initData] });
    },
  });
};

export default usePatchMember;
