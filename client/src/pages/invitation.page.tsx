import { handleImageError } from "../utils/imageErrorHandler";
import EBBComponent from "../components/enableBackButtonComponent";
import { useNavigate } from "react-router-dom";
import DevImage from "../assets/dev.png";
import useInitDataStore from "../stores/InitData.store";
import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import { useState } from "react";

const InvitationPage = () => {
  const navigate = useNavigate();
  const { initDataStartParam: communityId } = useInitDataStore();

  const handleAcceptInvitation = () => {
    navigate(`/registration/${communityId}`, { replace: true });
  };

  const { data: chatData } = useCommunityPreview(communityId ?? "");
  return (
    <EBBComponent>
      <div className="flex flex-col justify-center text-center max-w-[90%] mx-auto h-full gap-[40px]">
        <div className="flex flex-col items-center">
          <p className="font-semibold text-[20px]">Расскажите о себе!</p>
          <p className="text-hint font-normal text-[17px] mt-2 max-w-[80%]">
            Участники этого чата хотят узнать о вас больше
          </p>
        </div>

        <div className="flex flex-col gap-[10px] items-center rounded-lg">
          <img
            src={chatData?.avatar || DevImage}
            onError={handleImageError}
            className="w-[116px] h-[116px] rounded-full"
          />
          <div className="flex flex-col gap-0 max-w-[80%]">
            <p className="font-normal mt-[17px] text-black">
              {chatData?.name ?? "название чата"}
            </p>
            <p className="text-hint text-[15px]">
              Число участников: {chatData?.membersCount}
            </p>
          </div>
          <div className="mt-[17px] text-[15px] text-[#707579]">
            {chatData!.description.length > 90
              ? chatData?.description.slice(0, 90) + "..."
              : chatData?.description}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="px-[30px] py-[12px] bg-[#20C86E] rounded-[30px] text-white font-semibold"
            onClick={handleAcceptInvitation}
          >
            Хорошо 🤝
          </button>
        </div>
      </div>
    </EBBComponent>
  );
};

export default InvitationPage;
