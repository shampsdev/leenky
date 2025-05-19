import { useNavigate, useParams } from "react-router-dom";
import EBBComponent from "../../components/enableBackButtonComponent";
import SettingsButtonComponent from "../../components/settingsButtonComponent";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import useUserStore from "../../stores/user.store";
import Loader from "../../components/loader.component";

const CommunitySettingsPage = () => {
  const { communityId } = useParams();
  const { userData } = useUserStore();
  const { data: communityData, isPending } = useCommunity(communityId!);

  const navigate = useNavigate();

  if (isPending || !communityData) return <Loader />;

  const currentMember = communityData.members?.find(
    (member) => member.user.id === userData.id
  );
  const isAdmin = currentMember?.isAdmin === true;

  const goToProfileSettings = () => {
    if (isAdmin) {
      navigate(`/community/${communityId}/settings/profile`);
    }
  };

  const goToChatConnectionSettings = () => {
    navigate(`/community/${communityId}/settings/chat`);
  };

  const goToDescriptionSettings = () => {
    navigate(`/community/${communityId}/settings/description`);
  };

  const goToLinks = () => {
    navigate(`/community/${communityId}/settings/links`);
  };

  return (
    <EBBComponent>
      <div className="max-h-[100vh] overflow-auto scroll-container mx-auto">
        <div className="max-w-[95%] mx-auto mb-[28px] mt-[28px] ">
          <p className=" font-semibold text-[20px] px-[12px]">
            Настройки сообщества
          </p>
        </div>
        <div className="mx-auto flex flex-col gap-[16px] max-w-[95%] px-[4px]">
          {isAdmin && (
            <>
              <SettingsButtonComponent
                content="Профиль участника"
                onClick={goToProfileSettings}
              />
              <SettingsButtonComponent
                content="Привязка к чату"
                onClick={goToChatConnectionSettings}
              />
            </>
          )}
          <SettingsButtonComponent
            content="Основная информация"
            onClick={goToDescriptionSettings}
          />
          <SettingsButtonComponent
            content="Поделиться сообществом"
            onClick={goToLinks}
          />
        </div>
      </div>
    </EBBComponent>
  );
};

export default CommunitySettingsPage;
