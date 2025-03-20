import { initData } from "@telegram-apps/sdk-react";
import { useEffect, useCallback } from "react";
import { getMe } from "../api/api";
import { handleImageError } from "../utils/imageErrorHandler";
import InfoBlockComponent from "./infoBlock.component";
import InfoParagraphComponent from "./infoParagraph.component";
import useUserStore from "../stores/user.store";
import DevImage from "../assets/dev.png";
const ProfileViewComponent = () => {
  const { userData, updateUserData } = useUserStore();

  const fetchProfileData = useCallback(async () => {
    const data = await getMe(initData.raw() ?? "");
    if (data) {
      updateUserData(data);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center gap-[17px]">
        <img
          className="w-[115px] h-[115px] rounded-full object-cover"
          src={userData.avatar || DevImage}
          onError={handleImageError}
        />

        <div className="text-center">
          <p className="font-semibold inline-flex text-[20px] gap-[10px] items-center">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-hint text-[15px]">
            {`@${userData.telegramUsername}`}
          </p>
        </div>
      </div>
      <div className="rounded-lg mt-[15px]">
        <InfoBlockComponent>
          <InfoParagraphComponent
            title="Место работы"
            content={userData.company ?? ""}
          />
          <InfoParagraphComponent
            title="Должность"
            content={userData.role ?? ""}
          />
        </InfoBlockComponent>
        <div className="px-[16px] text-hint mb-[8px] mt-[15px] text-[13px]">
          ПОДРОБНЕЕ
        </div>
        <InfoBlockComponent>
          <InfoParagraphComponent
            title="Описание"
            content={userData.bio ?? ""}
          />
        </InfoBlockComponent>
      </div>
    </>
  );
};

export default ProfileViewComponent;
