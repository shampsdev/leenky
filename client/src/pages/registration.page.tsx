import { useState, useEffect, useCallback } from "react";
import InputFieldComponent from "../components/inputField.component";
import TextareaFieldComponent from "../components/textareaField.component";
import { UserData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";
import {
  initData,
  initDataStartParam,
  initDataUser,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";
import EBBComponent from "../components/enableBackButtonComponent";
import { createMe, getMePreview, joinMe } from "../api/api";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/user.store";
import DevImage from "../assets/dev.png";
import ButtonComponent from "../components/button.component";

const RegistrationPage = () => {
  const launchParams = retrieveLaunchParams();

  const startParam = initDataStartParam();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const avatar = initDataUser()?.photo_url;
  const [profileData, setProfileData] = useState<
    Pick<UserData, "firstName" | "lastName" | "bio" | "role" | "company">
  >({
    firstName: initDataUser()?.first_name || "",
    lastName: initDataUser()?.last_name || "",
    company: "",
    role: "",
    bio: "",
  });
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const isProfileFilled = () => {
    const isFilled =
      profileData.firstName?.trim() != "" &&
      profileData.lastName?.trim() !== "" &&
      profileData.company?.trim() !== "" &&
      profileData.role?.trim() !== "" &&
      profileData.bio?.trim() !== "";

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
  const checkAuth = async () => {
    userStore.setIsLoading(true);
    const userData = await getMePreview(initData.raw() ?? "");
    if (userData?.isRegistered) {
      userStore.authenticate();
      userStore.setIsLoading(false);
      userStore.updateUserData(userData);
    } else {
      userStore.setIsLoading(false);
    }
  };

  const registerUser = async () => {
    const response = await createMe(initData.raw() ?? "", profileData);
    if (response) {
      checkAuth();
      navigate("/chats", { replace: true });

      if (startParam !== undefined && startParam.length > 0) {
        const joinResponse = await joinMe(initData.raw() ?? "", startParam);
        if (joinResponse) {
          navigate(`/chat/${startParam}`);
        }
      }
    }
  };

  const fetchBio = useCallback(async () => {
    const data = await getMePreview(initData.raw() ?? "");
    if (data) {
      setProfileData((prevState) => ({
        ...prevState,
        bio: data.bio,
      }));
    }
  }, []);
  useEffect(() => {
    fetchBio();
  }, []);
  useEffect(() => {
    setIsFilled(isProfileFilled());
  }, [profileData]);

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
            ? "w-[95%] mx-auto py-4 px-4  h-[140vh]"
            : "w-[95%] mx-auto py-4 px-4 "
        }
      >
        <div className="flex flex-col items-center gap-[17px]">
          <img
            className="w-[115px] h-[115px] rounded-full object-cover"
            src={avatar || DevImage}
            onError={handleImageError}
          />
        </div>
        <div className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]">
          <InputFieldComponent
            onBlur={onBlurHandler}
            onFocus={onFocusHandler}
            title="Имя"
            onChangeFunction={(value) => handleInputChange("firstName", value)}
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
            value={profileData.company ?? ""}
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
        </div>

        {launchParams.tgWebAppPlatform !== "ios" && (
          <div className="pt-[40px] pb-[39px]"></div>
        )}
        {launchParams.tgWebAppPlatform === "ios" && (
          <div
            onClick={() => {
              if (isFilled) registerUser();
            }}
            className="flex w-full justify-center pt-[20px]"
          >
            <ButtonComponent
              content={"Готово"}
              handleClick={() => {
                if (isFilled) registerUser();
              }}
              state={isFilled ? "active" : "disabled"}
            />
          </div>
        )}
      </div>

      {launchParams.tgWebAppPlatform !== "ios" && (
        <div className="absolute bottom-0 flex justify-center w-full pb-[10px]">
          <FixedBottomButtonComponent
            content={"Готово"}
            handleClick={() => {
              if (isFilled) registerUser();
            }}
            state={isFilled ? "active" : "disabled"}
          />
        </div>
      )}
    </EBBComponent>
  );
};
export default RegistrationPage;
