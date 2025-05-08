import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import useUserStore from "../stores/user.store";

interface ProfileComponentProps {
  onClick?: () => void;
}
const ProfileComponent = (props: ProfileComponentProps) => {
  const avatar = useUserStore().userData.avatar;

  return (
    <>
      <div className="" onClick={props.onClick}>
        <img
          className="w-[36px] h-[36px] rounded-full"
          src={avatar || DevImage}
          onError={handleImageError}
        />
      </div>
    </>
  );
};

export default ProfileComponent;
