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
import ButtonComponent from "../components/button.component";
const EditProfilePage = () => {
  const navigate = useNavigate();

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [initialHeight] = useState(window.innerHeight);

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

  useEffect(() => {
    const handleResize = () => {
      const threshold = 150;
      if (initialHeight - window.innerHeight > threshold) {
        setKeyboardOpen(true);
      } else {
        setKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, [initialHeight]);

  return (
    <EBBComponent>
      <div
        className={
          keyboardOpen ? "flex flex-col h-[160vh]" : "flex flex-col h-screen"
        }
      >
        <div className="w-[95%] mx-auto px-4 overflow-y-auto flex-1">
          <div className="flex flex-col mt-[25px] items-center gap-[17px]">
            <img
              className="w-[115px] h-[115px] rounded-full object-cover"
              src={profileData.avatar || DevImage}
              onError={handleImageError}
            />
          </div>
          <div className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]">
            <InputFieldComponent
              title="Имя"
              onChangeFunction={(value) =>
                handleInputChange("firstName", value)
              }
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
        </div>
        {keyboardOpen && (
          <div className="fixed bottom-0 flex justify-center w-full pb-[10px]">
            <ButtonComponent
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
        {!keyboardOpen && (
          <div className="pt-[20px] pb-[39px] flex justify-center">
            <ButtonComponent
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
      </div>
    </EBBComponent>
  );
};
export default EditProfilePage;
