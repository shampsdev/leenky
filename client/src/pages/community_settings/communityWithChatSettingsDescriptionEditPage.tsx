import { useNavigate, useParams } from "react-router-dom";
import EBBComponent from "../../components/enableBackButtonComponent";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";
import TextareaFieldComponent from "../../components/form/textareaField.component";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import { useState } from "react";
import usePatchCommunity from "../../hooks/communities/mutations/usePatchCommunity";

const CommunityWithChatSettingsDescriptionEditPage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();

  const patchCommunityMutation = usePatchCommunity();

  const { data: communityData, isPending } = useCommunity(communityId!);
  const [description, setDescription] = useState<string>(
    communityData?.description!
  );

  if (isPending) return null;

  const handleClick = async () => {
    try {
      await patchCommunityMutation.mutateAsync({
        communityData: {
          avatar: communityData?.avatar!,
          config: communityData?.config!,
          description: description,
          id: communityData?.id!,
          name: communityData?.name!,
          tgChatID: communityData?.tgChatID,
        },
      });
      navigate(-1);
    } catch (error) {
      alert("Произошла ошибка при обновлении сообщества");
      console.error("Ошибка при патче сообщества:", error);
    }
  };
  return (
    <EBBComponent>
      <div className="w-[95%] mx-auto px-4 overflow-y-auto ">
        <div className="mb-[32px] mt-[28px]">
          <p className="font-semibold text-[20px] ml-[12px]  ">
            Основная информация
          </p>
        </div>

        <TextareaFieldComponent
          onChangeFunction={setDescription}
          title={"Описание сообщества"}
          value={description}
          maxLength={240}
          resizable
          fillNotRequired
        />

        <div className="flex w-full justify-center pt-[20px]">
          <FixedBottomButtonComponent
            content="Подтвердить"
            state={
              description !== communityData?.description ? "active" : "disabled"
            }
            handleClick={handleClick}
          />
        </div>
        <div className="pb-[200px]"></div>
      </div>
    </EBBComponent>
  );
};

export default CommunityWithChatSettingsDescriptionEditPage;
