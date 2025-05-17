import { useNavigate } from "react-router-dom";
import EBBComponent from "../../../components/enableBackButtonComponent";
import TextareaFieldComponent from "../../../components/form/textareaField.component";
import FixedBottomButtonComponent from "../../../components/fixedBottomButton.component";
import InputFieldComponent from "../../../components/form/inputField.component";
import useCommunityWithoutChatInfoStore from "../../../stores/create_community/communityWithoutChatInfo.store";
import UploadImage from "../../../assets/upload.svg";
import { useRef, useState } from "react";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../../shared/constants";

const CommunityWithoutChatDescriptionPage = () => {
  const navigate = useNavigate();

  const { setDescription, description, setName, name, avatar, setAvatar } =
    useCommunityWithoutChatInfoStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    avatar ? URL.createObjectURL(avatar) : ""
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    setErrorMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrorMessage("Допустимы PNG или JPG");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage("Размер файла не должен превышать 5 МБ");
        return;
      }
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <EBBComponent>
      <div className="flex flex-col gap-[32px]">
        <div className="mt-[28px]">
          <p className="font-semibold text-[20px] ml-[12px]">
            Основная информация
          </p>
        </div>

        <InputFieldComponent
          onChangeFunction={setName}
          title={"Название"}
          value={name}
          maxLength={60}
          fillNotRequired
        />

        <TextareaFieldComponent
          onChangeFunction={setDescription}
          title={"Описание сообщества"}
          value={description}
          maxLength={240}
          resizable
          fillNotRequired
        />

        <div className="flex flex-col gap-[24px]">
          <p className="font-semibold text-[20px] ml-[12px]">
            Аватар сообщества
          </p>

          <div>
            <div className="flex flex-row w-full gap-[12px]">
              {avatar !== null && previewUrl !== null && (
                <div className="w-1/4 aspect-square bg-[#F5F5F5] rounded-[14px] overflow-hidden flex items-center justify-center">
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                </div>
              )}

              <div
                className="flex-1 text-center flex flex-col items-center justify-center text-[#A2ACB0] bg-[#F5F5F5] py-[24px] rounded-[14px] gap-[8px] cursor-pointer"
                onClick={handleUploadClick}
              >
                <img src={UploadImage} alt="Upload icon" />
                <p>загрузить с устройства</p>
              </div>
              <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {errorMessage && (
              <div className="text-[15px] mt-[5px] ml-[12px] text-[#E53935]">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center pt-[20px]">
        <FixedBottomButtonComponent
          content="Продолжить"
          state={name && description && avatar ? "active" : "disabled"}
          handleClick={() => {
            if (name && description && avatar)
              navigate("/community/create/without_chat/profile");
          }}
        />
      </div>
      <div className="pb-[200px]"></div>
    </EBBComponent>
  );
};

export default CommunityWithoutChatDescriptionPage;
