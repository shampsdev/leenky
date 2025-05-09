import useCommunityPreview from "../communities/fetchHooks/useCommunityPreview";
import useGetMe from "../users/fetchHooks/useGetMe";

export const useCommunityProfileEditData = (
  communityId: string | undefined
) => {
  const { data: previewData, isPending: isPreviewPending } =
    useCommunityPreview(communityId ?? "");

  const { data: userData, isPending: isUserPending } = useGetMe();

  const member = userData?.members.find(
    (member) => member.community.id === communityId
  );

  const fields = previewData?.config.fields.map((field) => {
    const value = member?.config.fields[field.title]?.[field.type]?.value ?? "";

    return {
      ...field,
      [field.type]: {
        ...field[field.type],
        default: value,
      },
    };
  });

  return {
    isPending: isPreviewPending || isUserPending,
    avatar: userData?.user.avatar,
    fields,
  };
};
