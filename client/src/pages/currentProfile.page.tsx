import { initData } from "@telegram-apps/sdk-react";
import { useEffect, useCallback } from "react";
import { getMe } from "../api/api";
import { handleImageError } from "../utils/imageErrorHandler";
import InfoBlockComponent from "../components/infoBlock.component";
import InfoParagraphComponent from "../components/infoParagraph.component";
import useUserStore from "../stores/user.store";
import { useNavigate } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import DevImage from "../assets/dev.png";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";

const CurrentProfilePage = () => {
  const { userData, updateUserData } = useUserStore();
  const navigate = useNavigate();

  const goToEditProfilePage = () => {
    navigate("/profile/edit");
  };

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
    <EBBComponent>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto w-[95%] mx-auto px-4">
          <div className="flex flex-col mt-6 items-center gap-4">
            <img
              className="w-[115px] h-[115px] rounded-full object-cover"
              src={userData.avatar || DevImage}
              onError={handleImageError}
            />
            <div className="text-center">
              <p className="font-semibold inline-flex text-lg gap-2 items-center">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-hint text-sm">
                {`@${userData.telegramUsername}`}
              </p>
            </div>
          </div>

          <div className="rounded-lg mt-4 mx-auto">
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
            <div className="px-4 text-hint mb-2 mt-4 text-sm">ПОДРОБНЕЕ</div>
            <InfoBlockComponent>
              <InfoParagraphComponent
                title="Описание"
                content={userData.bio ?? ""}
              />
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

export default CurrentProfilePage;
