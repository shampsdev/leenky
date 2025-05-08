import { useNavigate, useParams } from "react-router-dom";
import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import useInitDataStore from "../stores/InitData.store";
import { MemberConfig } from "../types/member/memberConfig.interface";
import DynamicForm from "../utils/dynamicForm";
import useJoinCommunity from "../hooks/communities/mutations/useJoinCommunity";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const { initDataUser } = useInitDataStore();
  const { initDataStartParam: chatId } = useInitDataStore();
  const { data, isPending } = useCommunityPreview(chatId ?? "");
  const fields = data?.config.fields;
  const useJoinCommunityMutation = useJoinCommunity();
  const handleSubmit = async (data: MemberConfig) => {
    await useJoinCommunityMutation.mutateAsync({
      communityId: communityId!,
      memberConfig: data,
    });
    navigate(`/communities`, { replace: true });
    navigate(`/community/${communityId}`);
  };

  if (isPending) return null;

  return (
    <DynamicForm
      fields={fields ?? []}
      onSubmit={handleSubmit}
      avatar={initDataUser?.photo_url}
    />
  );
};

export default RegistrationPage;
