import { useEffect, useState } from "react";
import { ChatPreviewData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";
import { getChatPreview, joinMe } from "../api/api";
import { initData, initDataStartParam } from "@telegram-apps/sdk-react";

const InvitationPage = () => {
  const chatId = initDataStartParam() ?? "";

  const accept = async () => {
    await joinMe(initData.raw() ?? "", chatId);
  };

  const [chatData, setChatData] = useState<ChatPreviewData>();

  const fetchChatData = async () => {
    const fetchedChatData = await getChatPreview(initData.raw() ?? "", chatId);
    if (fetchedChatData) {
      setChatData(fetchedChatData);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [chatData]);
  return (
    <div className="flex flex-col justify-center text-center max-w-[90%] mx-auto h-full gap-[40px]">
      <div className="flex flex-col items-center">
        <p className="font-semibold text-[20px]">Расскажите о себе!</p>
        <p className="text-hint font-normal text-[17px] mt-2 max-w-[80%]">
          Участники этого чата хотят узнать о вас больше
        </p>
      </div>

      <div
        v-if="inviteStore.chat"
        className="flex flex-col gap-[10px] items-center rounded-lg"
      >
        <img
          src={chatData?.avatar ?? undefined}
          onError={handleImageError}
          className="w-[116px] h-[116px] rounded-full"
        />
        <div className="flex flex-col gap-0 max-w-[80%]">
          <p className="font-normal mt-[17px] text-black">
            {chatData?.name ?? "название чата"}
          </p>
          <p className="text-hint text-[15px]">
            Число участников: {chatData?.usersAmount}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="px-[30px] py-[12px] bg-[#20C86E] rounded-[30px] text-white font-semibold"
          onClick={accept}
        >
          Хорошо 🤝
        </button>
      </div>
    </div>
  );
};

export default InvitationPage;
