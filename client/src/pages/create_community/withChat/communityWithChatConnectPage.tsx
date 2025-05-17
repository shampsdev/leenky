import EBBComponent from "../../../components/enableBackButtonComponent";
import StepComponent from "../../../components/step.component";
import Plus from "../../../assets/plus_white.svg";
import CopyIcon from "../../../assets/copy_icon.svg";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { BOT_USERNAME } from "../../../shared/constants";
import { useEffect, useState } from "react";
import FixedBottomButtonComponent from "../../../components/fixedBottomButton.component";
import useCreateCommunity from "../../../hooks/communities/mutations/useCreateCommunity";
import useCommunityWithChatInfoStore from "../../../stores/create_community/communityWithChatInfo.store";
import { useNavigate } from "react-router-dom";
const CommunityWithChatConnectPage = () => {
  const { fields, setChatId, chatId, description } =
    useCommunityWithChatInfoStore();
  const [command] = useState<string>(`/connect ${chatId}`);
  const createCommunityMutation = useCreateCommunity();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const createCommunity = async () => {
      try {
        setIsLoading(true);
        console.log(fields);
        const community = await createCommunityMutation.mutateAsync({
          communityData: {
            avatar: "",
            config: {
              fields: fields,
            },
            description: description,
            name: "",
          },
        });

        if (community) {
          setChatId(community.id);
        } else {
          alert("Уупс, произошла ошибка");
          navigate(-1);
        }
      } catch (error) {
        console.error("Ошибка создания сообщества:", error);
        alert("Произошла ошибка при создании сообщества");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    createCommunity();
  }, []);

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
          {isLoading ? (
            <div className="animate-pulse flex flex-row gap-[10px] py-[12px] px-[16px] border-[2px] rounded-[14px] border-[#F5F5F5]">
              <div className="flex-1 h-[20px] bg-[#E5E5E5] rounded-[4px]"></div>
            </div>
          ) : (
            <div className="flex flex-row gap-[10px] py-[12px] px-[16px] border-[2px] rounded-[14px] border-[#F5F5F5] text-black text-[17px]">
              <p className="flex-1">{command}</p>
              <img
                src={CopyIcon}
                alt=""
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(command);
                }}
              />
            </div>
          )}
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
            value="Скопируйте команду с вашим ChatID"
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
        handleClick={() => {}}
      />
      <div className="pb-[200px]"></div>
    </EBBComponent>
  );
};

export default CommunityWithChatConnectPage;
