import { openTelegramLink } from "@telegram-apps/sdk-react";
import { useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import InfoBlockComponent from "../components/infoBlock.component";
import InfoParagraphComponent from "../components/infoParagraph.component";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import ButtonComponent from "../components/button.component";
import TGWhite from "../assets/tg_white.svg";
import useMember from "../hooks/members/fetchHooks/useMember";
import { useExtractFields } from "../hooks/utils/extractFields";
const ProfilePage = () => {
  const { communityId, memberId } = useParams();
  const { data, isLoading } = useMember(communityId ?? "", memberId ?? "");

  const { textInputs, textAreas } = useExtractFields(data?.config.fields);

  if (isLoading || !data) return null;

  const userData = data.user;

  return (
    <EBBComponent>
      <div className="w-[95%] mx-auto px-4 overflow-y-auto ">
        <div className="flex flex-col mt-[25px] items-center gap-[17px]">
          <img
            className="w-[115px] h-[115px] rounded-full object-cover"
            src={userData?.avatar || DevImage}
            onError={handleImageError}
          />

          <div className="text-center">
            <p className="font-semibold inline-flex text-[20px] gap-[10px] items-center">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-hint text-[15px]">
              {`@${userData?.telegramUsername}`}
            </p>
          </div>
          <ButtonComponent
            content={
              <>
                Написать <img src={TGWhite} />
              </>
            }
            handleClick={() => {
              openTelegramLink(`https://t.me/${userData?.telegramUsername}`);
            }}
            state={"active"}
          />
        </div>
        <div className="rounded-lg mt-[15px] mx-auto">
          <InfoBlockComponent>
            {textInputs.map((field, index) => (
              <InfoParagraphComponent
                title={field.name}
                content={field.value}
                key={index}
              />
            ))}
          </InfoBlockComponent>
          <div className="px-[16px] text-hint mb-[8px] mt-[15px] text-[13px]">
            ПОДРОБНЕЕ
          </div>
          <InfoBlockComponent>
            {textAreas.map((field, index) => (
              <InfoParagraphComponent
                title={field.name}
                content={field.value}
                key={index}
              />
            ))}
          </InfoBlockComponent>
        </div>
      </div>
    </EBBComponent>
  );
};

export default ProfilePage;
