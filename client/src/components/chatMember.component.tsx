import { useNavigate } from "react-router-dom";
import { UserData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";

import DevImage from "../assets/dev.png";
interface ChatMemverComponentProps {
  userData: UserData;
}
const ChatMemberComponent = (props: ChatMemverComponentProps) => {
  const navigate = useNavigate();
  return (
    <li
      className="chat-item rounded-[15px] relative flex w-full items-center gap-[7px] cursor-pointer overflow-hidden"
      onClick={() => {
        navigate(`/profile/${props.userData.id}`);
      }}
    >
      <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300">
        <img
          src={props.userData.avatar || DevImage}
          onError={handleImageError}
          className="w-[60px] h-[60px] rounded-full aspect-square object-cover"
        />
        <div className="flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-normal text-[17px]">
              {props.userData.firstName} {props.userData.lastName}
            </p>
            <p className="text-hint font-light text-[15px]">
              {props.userData.company}
            </p>

            <p className="text-hint font-light text-[15px]">
              {props.userData.role}
            </p>
            <p className="text-hint font-light text-[15px]">
              {props.userData.bio && props.userData.bio.length > 30
                ? props.userData.bio.slice(0, 30) + "..."
                : props.userData.bio}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ChatMemberComponent;
