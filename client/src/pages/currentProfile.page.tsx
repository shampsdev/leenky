import { useCallback, useEffect, useState } from "react";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";
import { ProfileUserData, UserData } from "../types/user.interface";
import { getMe, postMe } from "../api/api";
import { backButton, initData, initDataRaw } from "@telegram-apps/sdk-react";
import { handleImageError } from "../utils/imageErrorHandler";
import useCurrentProfileStore, {
  useEditProfileStore,
} from "../stores/profile.store";
import InputFieldComponent from "../components/inputField.component";
import TextareaFieldComponent from "../components/textareaField.component";
import ProfileViewComponent from "../components/profileView.component";

const ProfileEdit = () => {
  const currentProfileStore = useCurrentProfileStore();

  const [profileData, setProfileData] = useState<UserData>({
    firstName: null,
    lastName: null,
    company: null,
    role: null,
    avatar: null,
    telegramUsername: null,
    bio: null,
    id: null,
    telegramId: null,
  });

  const isProfileChanged = (newProfileData: ProfileUserData) => {
    const isChanged =
      newProfileData.firstName !== profileData.firstName ||
      newProfileData.lastName !== profileData.lastName ||
      newProfileData.company !== profileData.company ||
      newProfileData.role !== profileData.role ||
      newProfileData.bio !== profileData.bio;

    return isChanged;
  };

  const fetchProfileData = useCallback(async () => {
    const data = await getMe(initData.raw() ?? "");
    if (data) {
      setProfileData(data);
      currentProfileStore.updateProfileData(data);
    }
  }, []);

  const MAX_INPUT_LENGTH = 40;
  const MAX_TEXTAREA_LENGTH = 230;

  const handleInputChange = (field: keyof UserData, value: string) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (isProfileChanged(profileData)) {
      currentProfileStore.isChanged = true;
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const editProfileStore = useEditProfileStore();
    editProfileStore.setProfileData(profileData);
  }, [profileData]);

  return (
    <>
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
          value={profileData.company ?? ""}
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
    </>
  );
};

const CurrentProfilePage = () => {
  const profileStore = useCurrentProfileStore();
  const editProfileStore = useEditProfileStore();
  const handleButtonClick = async () => {
    if (profileStore.isChanged && profileStore.isEditing) {
      try {
        await postMe(initDataRaw() || "", editProfileStore.profileData);
        profileStore.updateIsEditing(!profileStore.isEditing);
        editProfileStore.setProfileData;
        profileStore.isEditing = false;
      } catch (err) {
        console.error("Error saving profile", err);
        return;
      }
    } else if (profileStore.isEditing && !profileStore.isChanged) {
      profileStore.isEditing = false;
    } else if (!profileStore.isEditing) {
      profileStore.isEditing = true;
    }
  };

  backButton.show();

  useEffect(() => {
    profileStore.reset();
    editProfileStore.reset();
  }, []);

  return (
    <>
      <div className="w-full">
        {profileStore.isEditing ? (
          <ProfileEdit />
        ) : (
          <ProfileViewComponent isCurrentUser={true} />
        )}
      </div>
      <FixedBottomButtonComponent
        content={profileStore.isChanged ? "Сохранить" : "Редактировать"}
        handleClick={handleButtonClick}
        state={
          !profileStore.isChanged && profileStore.isEditing
            ? "disabled"
            : "active"
        }
      />
    </>
  );
};

export default CurrentProfilePage;
