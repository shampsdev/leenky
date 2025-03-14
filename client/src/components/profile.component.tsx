import { initData } from "@telegram-apps/sdk-react";
import { handleImageError } from "../utils/imageErrorHandler";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
  const avatar = initData.user()?.photo_url;
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile");
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
