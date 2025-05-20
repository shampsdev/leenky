import { openTelegramLink } from "@telegram-apps/sdk-react";
import CopyFieldComponent from "../../components/copyField.component";
import EBBComponent from "../../components/enableBackButtonComponent";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";
import StepComponent from "../../components/step.component";
import { BOT_USERNAME } from "../../shared/constants";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import Plus from "../../assets/plus_white.svg";
import StarByak from "../../assets/star_buka.png";
import Loader from "../../components/loader.component";
const CommunitySettingsChatPage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const { data: communityData, isPending } = useCommunity(communityId!);

  if (isPending) return <Loader />;

  if (communityData?.tgChatID !== 0 && communityData?.tgChatID) {
    return (
      <EBBComponent>
        <div className="w-[95%] mx-auto px-4 overflow-y-auto ">
          <div className="mb-[28px] mt-[28px] px-[12px]">
            <p className="font-semibold text-[20px]">Привязка к чату</p>
          </div>
          <div className="flex mt-[25px] flex-col  justify-center gap-[24px]">
            <div className="flex flex-col justify-center gap-[12px] items-center py-[24px]">
              <img className="max-w-[60%]" src={StarByak} alt="" />
              <div className="text-center text-[20px] font-semibold"></div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="text-[20px] text-center  px-[12px]">
                Сообщество уже привязано к чату!
              </p>
            </div>
          </div>
        </div>
      </EBBComponent>
    );
  }

  return (
    <EBBComponent>
      <div className="w-[95%] mx-auto px-4 overflow-y-auto ">
        <div className="mb-[28px] mt-[28px] px-[12px]">
          <p className="font-semibold text-[20px]">Привязка к чату</p>
        </div>

        <div className="flex flex-col gap-[36px]">
          <div className="flex flex-col gap-[16px]">
            <StepComponent
              stepNumber={1}
              value="Скопируйте команду с вашим ChatID"
            />

            <CopyFieldComponent content={`/connect ${communityId}`} />
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
      </div>

      <FixedBottomButtonComponent
        content="Назад"
        state={"active"}
        handleClick={() => {
          navigate(-1);
        }}
      />
      <div className="pb-[200px]"></div>
    </EBBComponent>
  );
};

export default CommunitySettingsChatPage;
