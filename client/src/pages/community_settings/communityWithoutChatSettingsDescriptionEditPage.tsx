import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EBBComponent from "../../components/enableBackButtonComponent";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";
import InputFieldComponent from "../../components/form/inputField.component";
import TextareaFieldComponent from "../../components/form/textareaField.component";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../shared/constants";
import UploadImage from "../../assets/upload.svg";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import usePatchCommunity from "../../hooks/communities/mutations/usePatchCommunity";
import useSetCommunityAvatar from "../../hooks/communities/mutations/usePostAvatarCommunity";

const CommunityWithoutChatSettingsDescriptionEditPage = () => {
  const patchCommunityMutation = usePatchCommunity();
  const setCommunityAvatarMutation = useSetCommunityAvatar();

  const navigate = useNavigate();
  const { communityId } = useParams();
  const { data: communityData } = useCommunity(communityId!);

  const [avatar, setAvatar] = useState<File | null>(null);

  const [description, setDescription] = useState<string | null>(
    communityData?.description ?? null
  );
  const [name, setName] = useState<string | null>(communityData?.name ?? null);

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

  const handleClick = async () => {
    try {
      const response = await patchCommunityMutation.mutateAsync({
        communityData: {
          avatar: communityData?.avatar!,
          config: communityData?.config!,
          description: description!,
          id: communityId!,
          name: name!,
        },
      });

      if (response) {
        await setCommunityAvatarMutation.mutateAsync({
          communityId: communityId!,
          avatar: avatar!,
        });
      }
      navigate(-1);
    } catch (error) {
      alert("Произошла ошибка при обновлении сообщества");
      console.error("Ошибка при патче сообщества:", error);
    }
  };

  return (
    <EBBComponent>
      <div className="max-w-[95%]   overflow-auto scroll-container mx-auto px-4">
        <div className="flex flex-col gap-[32px]">
          <div className="mt-[28px]">
            <p className="font-semibold text-[20px] ml-[12px]">
              Основная информация
            </p>
          </div>

          <InputFieldComponent
            onChangeFunction={setName}
            title={"Название"}
            value={name ?? ""}
            maxLength={60}
            fillNotRequired
          />

          <TextareaFieldComponent
            onChangeFunction={setDescription}
            title={"Описание сообщества"}
            value={description ?? ""}
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
            content="Подтвердить"
            state={name && description && avatar ? "active" : "disabled"}
            handleClick={async () => await handleClick()}
          />
        </div>
        <div className="pb-[200px]"></div>
      </div>
    </EBBComponent>
  );
};

export default CommunityWithoutChatSettingsDescriptionEditPage;
