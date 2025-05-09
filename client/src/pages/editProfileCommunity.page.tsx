import { useNavigate, useParams } from "react-router-dom";
import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import useJoinCommunity from "../hooks/communities/mutations/useJoinCommunity";
import { MemberConfig } from "../types/member/memberConfig.interface";
import DynamicForm from "../utils/dynamicForm";
import { useCommunityProfileEditData } from "../hooks/utils/communityProfileEditData";

const EditProfileCommunityPage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  //   const { data } = useCommunityPreview(communityId ?? "");

  const { fields, isPending, avatar } =
    useCommunityProfileEditData(communityId);

  const handleSubmit = async (data: MemberConfig) => {
    alert("АХХАХАХАХХАХА А РУЧКИ ТО НЕТУ))))");
    navigate("/communities");
  };

  if (isPending) return null;

  return (
    <DynamicForm
      fields={fields ?? []}
      onSubmit={handleSubmit}
      avatar={avatar}
    />
  );
};

export default EditProfileCommunityPage;
