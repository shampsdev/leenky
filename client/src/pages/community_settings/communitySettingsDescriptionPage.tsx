import EBBComponent from "../../components/enableBackButtonComponent";
import InfoBlockComponent from "../../components/infoBlock.component";
import InfoParagraphComponent from "../../components/infoParagraph.component";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import useUserStore from "../../stores/user.store";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";
import { handleImageError } from "../../utils/imageErrorHandler";
import DevImage from "../../assets/dev.png";
import useCommunityPreview from "../../hooks/communities/fetchHooks/useCommunityPreview";
import Loader from "../../components/loader.component";
const CommunitySettingsDescriptionPage = () => {
  const { communityId } = useParams();
  const { data: communityData, isPending } = useCommunity(communityId!);
  const { isPending: isPreviewPending } = useCommunityPreview(communityId!);
  const { userData } = useUserStore();
  const navigate = useNavigate();

  if (isPending || !communityData || isPreviewPending) return <Loader />;

  const currentMember = communityData.members?.find(
    (member) => member.user.id === userData.id
  );
  const isAdmin = currentMember?.isAdmin === true;
  const chatId = communityData.tgChatID;
  const goToEditDescription = () => {
    if (isAdmin) {
      if (chatId && chatId !== 0) {
        navigate(
          `/community/${communityId}/settings/description/edit/with_chat`
        );
      } else {
        navigate(
          `/community/${communityId}/settings/description/edit/without_chat`
        );
      }
    }
  };

  return (
    <EBBComponent>
      <div className="w-[95%] mx-auto px-4 overflow-y-auto ">
        <div className="flex flex-col mt-[25px] items-center gap-[17px]">
          <img
            className="w-[115px] h-[115px] rounded-full object-cover"
            src={communityData?.avatar || DevImage}
            onError={handleImageError}
          />

          <div className="text-center">
            <p className="font-semibold inline-flex text-[20px] gap-[10px] items-center">
              {communityData.name.length > 25
                ? communityData.name.slice(0, 25) + "..."
                : communityData.name}
            </p>
            <p className="text-hint text-[15px]">
              Участников: {communityData.members.length}
            </p>
          </div>
        </div>
        <div className="rounded-lg mt-[15px] mx-auto">
          <InfoBlockComponent>
            <InfoParagraphComponent
              title={"Описание"}
              content={communityData.description}
            />
          </InfoBlockComponent>
        </div>

        {isAdmin && (
          <FixedBottomButtonComponent
            content={"Редактировать"}
            handleClick={goToEditDescription}
            state={"active"}
          />
        )}
      </div>
    </EBBComponent>
  );
};

export default CommunitySettingsDescriptionPage;
