import { handleImageError } from "../utils/imageErrorHandler";
import InfoBlockComponent from "../components/infoBlock.component";
import InfoParagraphComponent from "../components/infoParagraph.component";
import { useNavigate, useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import DevImage from "../assets/dev.png";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import { useExtractFields } from "../hooks/utils/extractFields";
import chunkArray from "../utils/chunkArray";
import useCommunity from "../hooks/communities/fetchHooks/useСommunity";

const CommunityCurrentProfilePage = () => {
  const { communityId } = useParams();
  const { data, isLoading } = useGetMe();

  const { data: communityData } = useCommunity(communityId!);

  const fieldsData = data?.members.find(
    (member) => member.community.id === communityId
  )?.config.fields;
  const orderedFieldsPattern = communityData?.config.fields;

  const navigate = useNavigate();
  const goToEditProfilePage = () => {
    navigate(`/profile/current/${communityId}/edit`);
  };

  if (!data || isLoading) return null;

  const userData = data?.user;
  return (
    <EBBComponent>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto w-[95%] mx-auto px-4">
          <div className="flex flex-col mt-6 items-center gap-4">
            <img
              className="w-[115px] h-[115px] rounded-full object-cover"
              src={userData?.avatar || DevImage}
              onError={handleImageError}
            />
            <div className="text-center">
              <p className="font-semibold inline-flex text-lg gap-2 items-center">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-hint text-sm">
                {`@${userData?.telegramUsername}`}
              </p>
            </div>
          </div>

          <div className="rounded-lg mt-4 mx-auto">
            <InfoBlockComponent>
              {orderedFieldsPattern &&
                orderedFieldsPattern.map((field, index) => {
                  return (
                    <InfoParagraphComponent
                      title={field.title}
                      content={
                        fieldsData![field.title][field.type]?.value || ""
                      }
                      key={index}
                    />
                  );
                })}
            </InfoBlockComponent>
          </div>
          <div className="pt-[40px] pb-[39px]"></div>
        </div>
      </div>
      <FixedBottomButtonComponent
        content="Редактировать"
        handleClick={goToEditProfilePage}
        state="active"
      />
    </EBBComponent>
  );
};

export default CommunityCurrentProfilePage;
