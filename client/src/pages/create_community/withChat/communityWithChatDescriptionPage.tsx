import { useNavigate } from "react-router-dom";
import EBBComponent from "../../../components/enableBackButtonComponent";
import TextareaFieldComponent from "../../../components/form/textareaField.component";
import useCommunityInfoStore from "../../../stores/create_community/communityInfo.store";
import FixedBottomButtonComponent from "../../../components/fixedBottomButton.component";

const CommunityWithChatDescriptionPage = () => {
  const navigate = useNavigate();

  const { setDescription, description } = useCommunityInfoStore();
  return (
    <EBBComponent>
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
          content="Продолжить"
          state={true ? "active" : "disabled"}
          handleClick={() => navigate("/community/create/with_chat/profile")}
        />
      </div>
    </EBBComponent>
  );
};

export default CommunityWithChatDescriptionPage;
