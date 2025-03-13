import { initData } from "@telegram-apps/sdk-react";
import { useState, useEffect } from "react";
import { getMe, getUserById } from "../api/api";
import { UserData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";
import InfoBlockComponent from "./infoBlock.component";
import InfoParagraphComponent from "./infoParagraph.component";

interface ProfileViewComponentProps {
  isCurrentUser: boolean;
  id?: string;
}
const ProfileViewComponent = (props: ProfileViewComponentProps) => {
  const [profileData, setProfileData] = useState<UserData>({
    firstName: null,
    lastName: null,
    company: null,
    role: null,
    avatar: null,
    telegramUsername: null,
    bio: null,
    id: null,
    telegramId: null,
  });

  const fetchProfileData = async () => {
    if (props.isCurrentUser) {
      const data = await getMe(initData.raw() ?? "");
      if (data) {
        setProfileData(data);
      }
    } else {
      if (props.id !== undefined) {
        const data = await getUserById(initData.raw() ?? "", props.id);
        if (data) {
          setProfileData(data);
        }
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profileData]);

  return (
    <>
      <div className="flex flex-col items-center gap-[17px]">
        <img
          className="w-[115px] h-[115px] rounded-full object-cover"
          src={profileData.avatar ?? ""}
          onError={handleImageError}
        />

        <div className="text-center">
          <p className="font-semibold inline-flex text-[20px] gap-[10px] items-center">
            {profileData.firstName} {profileData.lastName}
          </p>
          <p className="text-hint text-[15px]">
            {`@${profileData.telegramUsername}`}
          </p>
        </div>
      </div>
      <div className="rounded-lg mt-[15px]">
        <InfoBlockComponent>
          <InfoParagraphComponent
            title="Место работы"
            content={profileData.company ?? ""}
          />
          <InfoParagraphComponent
            title="Должность"
            content={profileData.role ?? ""}
          />
        </InfoBlockComponent>
        <div className="px-[16px] text-hint mb-[8px] mt-[15px] text-[13px]">
          ПОДРОБНЕЕ
        </div>
        <InfoBlockComponent>
          <InfoParagraphComponent
            title="Описание"
            content={profileData.bio ?? ""}
          />
        </InfoBlockComponent>
      </div>
    </>
  );
};

export default ProfileViewComponent;
