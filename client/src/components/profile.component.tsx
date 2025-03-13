import { initData } from "@telegram-apps/sdk-react";
import { handleImageError } from "../utils/imageErrorHandler";

const ProfileComponent = () => {
  const avatar = initData.user()?.photo_url;
  const goToProfile = () => {
    //
  };

  return (
    <>
      <div className="" onClick={goToProfile}>
        <img
          className="w-[36px] h-[36px] rounded-full"
          src={avatar}
          onError={handleImageError}
        />
      </div>
    </>
  );
};

export default ProfileComponent;
