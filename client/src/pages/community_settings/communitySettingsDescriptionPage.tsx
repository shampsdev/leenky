import EBBComponent from "../../components/enableBackButtonComponent";
import InfoBlockComponent from "../../components/infoBlock.component";
import InfoParagraphComponent from "../../components/infoParagraph.component";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import useUserStore from "../../stores/user.store";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";

const CommunitySettingsDescriptionPage = () => {
  const { communityId } = useParams();
  const { data: communityData, isPending } = useCommunity(communityId!);
  const { userData } = useUserStore();
  const navigate = useNavigate();

  if (isPending || !communityData) return null;

  const currentMember = communityData.members?.find(
    (member) => member.user.id === userData.id
  );
  const isAdmin = currentMember?.isAdmin === true;
  const chatId = communityData.tgChatID;
  const goToEditDescription = () => {
    if (isAdmin) {
      if (chatId) {
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
        <div className="flex flex-col gap-[25px] rounded-lg mt-[25px] mx-auto">
          <InfoBlockComponent>
            <InfoParagraphComponent
              title={"Название"}
              content={communityData?.name!}
            />
          </InfoBlockComponent>
          <InfoBlockComponent>
            <InfoParagraphComponent
              title={"Описание сообщества"}
              content={communityData?.description!}
            />
          </InfoBlockComponent>
        </div>
      </div>
      {isAdmin && (
        <FixedBottomButtonComponent
          content={"Редактировать"}
          handleClick={goToEditDescription}
          state={"active"}
        />
      )}
    </EBBComponent>
  );
};

export default CommunitySettingsDescriptionPage;
