import { useNavigate, useParams } from "react-router-dom";
import EBBComponent from "../../components/enableBackButtonComponent";
import SettingsButtonComponent from "../../components/settingsButtonComponent";
const CommunitySettingsPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const goToProfileSettings = () => {
    navigate(`/community/${communityId}/settings/profile`);
  };

  const goToChatConnectionSettings = () => {
    navigate(`/community/${communityId}/settings/chat`);
  };

  const goToDescriptionSettings = () => {
    navigate(`/community/${communityId}/settings/description`);
  };

  return (
    <EBBComponent>
      <div className="max-h-[100vh] overflow-auto scroll-container mx-auto">
        <div className="mb-[28px] mt-[28px] px-[12px]">
          <p className="font-semibold text-[20px]">Настройки сообщества</p>
        </div>
        <div className="mx-auto flex flex-col gap-[16px] max-w-[95%] px-[4px]">
          <SettingsButtonComponent
            content="Профиль участника"
            onClick={() => {}}
          />
          <SettingsButtonComponent
            content="Привязка к чату"
            onClick={() => {}}
          />
          <SettingsButtonComponent
            content="Основная информация"
            onClick={() => {}}
          />
        </div>
      </div>
    </EBBComponent>
  );
};

export default CommunitySettingsPage;
