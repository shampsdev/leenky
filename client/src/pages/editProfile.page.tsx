import { useState, useEffect } from "react";
import InputFieldComponent from "../components/inputField.component";
import TextareaFieldComponent from "../components/textareaField.component";
import { UserData, ProfileUserData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";
import useUserStore from "../stores/user.store";
import { getMe, postMe } from "../api/api";
import { initData } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import DevImage from "../assets/dev.png";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";
import ButtonComponent from "../components/button.component";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

const EditProfilePage = () => {
  const launchParams = retrieveLaunchParams();
  const navigate = useNavigate();

  const { userData, updateUserData } = useUserStore();
  const [profileData, setProfileData] = useState<
    Omit<UserData, "isRegistered">
  >({ ...userData });

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(true);
  const isProfileChanged = (newProfileData: ProfileUserData) => {
    const isChanged =
      newProfileData.firstName !== userData.firstName ||
      newProfileData.lastName !== userData.lastName ||
      newProfileData.company !== userData.company ||
      newProfileData.role !== userData.role ||
      newProfileData.bio !== userData.bio;

    return isChanged;
  };

  const isProfileFilled = (
    newProfileData: Pick<
      UserData,
      "firstName" | "lastName" | "bio" | "role" | "company"
    >
  ) => {
    const isFilled =
      profileData.firstName?.trim() != "" &&
      profileData.lastName?.trim() !== "" &&
      profileData.company?.trim() !== "" &&
      profileData.role?.trim() !== "" &&
      newProfileData.bio?.trim() !== "";

    return isFilled;
  };

  const MAX_INPUT_LENGTH = 40;
  const MAX_TEXTAREA_LENGTH = 230;

  const handleInputChange = (field: keyof UserData, value: string) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const goBack = () => {
    navigate(-1);
  };
  const updateProfile = async () => {
    const newUserData = await postMe(initData.raw() ?? "", profileData);
    if (newUserData) {
      updateUserData(newUserData);
      setIsChanged(false);
      goBack();
    }
  };

  useEffect(() => {
    setIsChanged(isProfileChanged(profileData));
    setIsFilled(isProfileFilled(profileData));
  }, [profileData]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getMe(initData.raw() ?? "");
      if (data) {
        updateUserData(data);
        setProfileData(data);
      }
    };
    fetchProfileData();
  }, []);

  const [iosKeyboardOpen, setIosKeyboardOpen] = useState<boolean>(false);
  const [focusedFieldsCount, setFocusedFiledsCount] = useState<number>(0);
  const onFocusHandler = () => {
    setFocusedFiledsCount(focusedFieldsCount + 1);
  };
  const onBlurHandler = () => {
    setFocusedFiledsCount(focusedFieldsCount - 1);
  };
  const handleFieldsCount = () => {
    if (launchParams.tgWebAppPlatform === "ios") {
      if (focusedFieldsCount > 0) {
        setIosKeyboardOpen(true);
      }
      if (focusedFieldsCount === 0) {
        setIosKeyboardOpen(false);
      }
    }
  };
  useEffect(handleFieldsCount, [focusedFieldsCount]);
  return (
    <EBBComponent>
      <div
        className={
          iosKeyboardOpen
            ? "flex flex-col h-[150vh] "
            : "flex flex-col h-screen"
        }
      >
        <div className="w-[95%] mx-auto px-4 flex-1">
          <div className="flex flex-col mt-[25px] items-center gap-[17px]">
            <img
              className="w-[115px] h-[115px] rounded-full object-cover"
              src={profileData.avatar || DevImage}
              onError={handleImageError}
            />
          </div>
          <div className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]">
            <InputFieldComponent
              onBlur={onBlurHandler}
              onFocus={onFocusHandler}
              title="Имя"
              onChangeFunction={(value) =>
                handleInputChange("firstName", value)
              }
              value={profileData.firstName ?? ""}
              maxLength={MAX_INPUT_LENGTH}
            />
            <InputFieldComponent
              onBlur={onBlurHandler}
              onFocus={onFocusHandler}
              title="Фамилия"
              onChangeFunction={(value) => handleInputChange("lastName", value)}
              value={profileData.lastName ?? ""}
              maxLength={MAX_INPUT_LENGTH}
            />
            <InputFieldComponent
              onBlur={onBlurHandler}
              onFocus={onFocusHandler}
              title="Место работы"
              onChangeFunction={(value) => handleInputChange("company", value)}
              value={profileData.company ?? "null"}
              maxLength={MAX_INPUT_LENGTH}
            />
            <InputFieldComponent
              onBlur={onBlurHandler}
              onFocus={onFocusHandler}
              title="Должность"
              onChangeFunction={(value) => handleInputChange("role", value)}
              value={profileData.role ?? ""}
              maxLength={MAX_INPUT_LENGTH}
            />
            <TextareaFieldComponent
              onBlur={onBlurHandler}
              onFocus={onFocusHandler}
              onChangeFunction={(value) => handleInputChange("bio", value)}
              title="Описание"
              value={profileData.bio ?? ""}
              maxLength={MAX_TEXTAREA_LENGTH}
            />
            {launchParams.tgWebAppPlatform === "ios" && (
              <div className="w-full text-center mx-auto pb-[10px]">
                <ButtonComponent
                  content={
                    isChanged && isFilled ? "Сохранить" : "Редактировать"
                  }
                  handleClick={() => {
                    if (isFilled) {
                      if (isChanged) {
                        updateProfile();
                      } else {
                        goBack();
                      }
                    }
                  }}
                  state={isChanged && isFilled ? "active" : "disabled"}
                />
              </div>
            )}
            {launchParams.tgWebAppPlatform !== "ios" && (
              <div className="pt-[40px] pb-[39px]"></div>
            )}
          </div>
        </div>
      </div>

      {launchParams.tgWebAppPlatform !== "ios" && (
        <div className="absolute bottom-0 flex justify-center w-full pb-[10px]">
          <FixedBottomButtonComponent
            content={isChanged && isFilled ? "Сохранить" : "Редактировать"}
            handleClick={() => {
              if (isFilled) {
                if (isChanged) {
                  updateProfile();
                } else {
                  goBack();
                }
              }
            }}
            state={isChanged && isFilled ? "active" : "disabled"}
          />
        </div>
      )}
    </EBBComponent>
  );
};
export default EditProfilePage;
