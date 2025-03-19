import { useState, useEffect } from "react";
import InputFieldComponent from "../components/inputField.component";
import TextareaFieldComponent from "../components/textareaField.component";
import { UserData, ProfileUserData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";
import useUserStore from "../stores/user.store";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";
import { postMe } from "../api/api";
import { initData } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const { userData, updateUserData } = useUserStore();
  const [profileData, setProfileData] = useState<UserData>({ ...userData });
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const isProfileChanged = (newProfileData: ProfileUserData) => {
    const isChanged =
      newProfileData.firstName !== userData.firstName ||
      newProfileData.lastName !== userData.lastName ||
      newProfileData.company !== userData.company ||
      newProfileData.role !== userData.role ||
      newProfileData.bio !== userData.bio;

    return isChanged;
  };

  const MAX_INPUT_LENGTH = 40;
  const MAX_TEXTAREA_LENGTH = 230;

  const handleInputChange = (field: keyof UserData, value: string) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const updateProfile = async () => {
    const newUserData = await postMe(initData.raw() ?? "", profileData);
    if (newUserData) {
      updateUserData(newUserData);
      setIsChanged(false);
      goBack();
    }
  };
  const goBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    setIsChanged(isProfileChanged(profileData));
  }, [profileData]);

  return (
    <EBBComponent>
      <div className="flex flex-col items-center gap-[17px]">
        <img
          className="w-[115px] h-[115px] rounded-full object-cover"
          src={profileData.avatar ?? ""}
          onError={handleImageError}
        />
      </div>
      <div className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]">
        <InputFieldComponent
          title="Имя"
          onChangeFunction={(value) => handleInputChange("firstName", value)}
          value={profileData.firstName ?? ""}
          maxLength={MAX_INPUT_LENGTH}
        />
        <InputFieldComponent
          title="Фамилия"
          onChangeFunction={(value) => handleInputChange("lastName", value)}
          value={profileData.lastName ?? ""}
          maxLength={MAX_INPUT_LENGTH}
        />
        <InputFieldComponent
          title="Место работы"
          onChangeFunction={(value) => handleInputChange("company", value)}
          value={profileData.company ?? "null"}
          maxLength={MAX_INPUT_LENGTH}
        />
        <InputFieldComponent
          title="Должность"
          onChangeFunction={(value) => handleInputChange("role", value)}
          value={profileData.role ?? ""}
          maxLength={MAX_INPUT_LENGTH}
        />
        <TextareaFieldComponent
          onChangeFunction={(value) => handleInputChange("bio", value)}
          title="Описание"
          value={profileData.bio ?? ""}
          maxLength={MAX_TEXTAREA_LENGTH}
        />
      </div>
      <FixedBottomButtonComponent
        content={isChanged ? "Сохранить" : "Редактировать"}
        handleClick={() => {
          if (isChanged) {
            updateProfile();
          } else {
            goBack();
          }
        }}
        state={isChanged ? "active" : "disabled"}
      />
    </EBBComponent>
  );
};
export default EditProfilePage;
