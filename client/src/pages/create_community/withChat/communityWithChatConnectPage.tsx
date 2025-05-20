import EBBComponent from "../../../components/enableBackButtonComponent";
import StepComponent from "../../../components/step.component";
import Plus from "../../../assets/plus_white.svg";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { BOT_USERNAME } from "../../../shared/constants";
import { useState } from "react";
import FixedBottomButtonComponent from "../../../components/fixedBottomButton.component";
import useCommunityWithChatInfoStore from "../../../stores/create_community/communityWithChatInfo.store";
import { useNavigate } from "react-router-dom";
import CopyFieldComponent from "../../../components/copyField.component";
const CommunityWithChatConnectPage = () => {
  const { communityId } = useCommunityWithChatInfoStore();
  const [command] = useState<string>(`/connect ${communityId}`);

  const navigate = useNavigate();
  return (
    <EBBComponent>
      <div className="mb-[28px] mt-[28px] px-[12px]">
        <p className="font-semibold text-[20px]">Привязка к чату</p>
      </div>

      <div className="flex flex-col gap-[36px]">
        <div className="flex flex-col gap-[16px]">
          <StepComponent
            stepNumber={1}
            value="Скопируйте команду с вашим ChatID"
          />

          <CopyFieldComponent content={command} />
        </div>

        <div className="flex flex-col gap-[24px]">
          <StepComponent
            stepNumber={2}
            value="Добавьте бота в чат и отправьте ему скопированную команду"
          />
          <div
            className="flex justify-center text-[#FFFFFF] bg-[#20C86E] py-[24px] rounded-[14px] gap-[10px]"
            onClick={() => {
              openTelegramLink(`https://t.me/${BOT_USERNAME}?startgroup=`);
            }}
          >
            <p>Добавить в чат</p>
            <img className="" src={Plus} />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <StepComponent
            stepNumber={3}
            value="После этого вернитесь в Leenky и нажмите «Подтвердить»"
          />
          <div className="flex gap-[16px] items-start flex-row">
            <div className=" opacity-0 flex-shrink-0 flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#20C86E]/20 text-[#20C86E]">
              1
            </div>
            <div className="text-[#93979A] text-[17px] break-words">
              * привязать сообщество к чату
              <br /> можно только один раз
            </div>
          </div>
        </div>
      </div>

      <FixedBottomButtonComponent
        content="Продолжить"
        state={true ? "active" : "disabled"}
        handleClick={() => {
          navigate(`/communities`, { replace: true });
          navigate(`/profile/current/${communityId}`);
          navigate(`/profile/current/${communityId}/edit`);
          navigate(`/community/${communityId}/links`);
        }}
      />
      <div className="pb-[200px]"></div>
    </EBBComponent>
  );
};

export default CommunityWithChatConnectPage;
