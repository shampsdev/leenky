import { useNavigate } from "react-router-dom";
import { ChatPreviewData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import TrashBin from "../assets/trash_bin.svg";
interface ChatPreviewComponentProps {
  chatData: ChatPreviewData;
  view?: boolean;
  className?: string;
  underline?: boolean;
  deleteHandler?: () => void;
}
const ChatPreviewComponent = (props: ChatPreviewComponentProps) => {
  const navigate = useNavigate();
  if (props.view) {
    return (
      <li
        className={
          "chat-item rounded-[15px] relative flex w-full items-center gap-[7px]  overflow-hidden" +
          " " +
          props.className
        }
      >
        <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300">
          <img
            src={props.chatData.avatar || DevImage}
            onError={handleImageError}
            className="w-[60px] h-[60px] rounded-full aspect-square object-cover"
          />
          <div
            className={
              "flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px]"
            }
          >
            <div className="flex flex-col gap-[2px]">
              <p className="font-normal text-[17px]">{props.chatData.name}</p>
              <p className="text-hint font-light text-[15px]">
                {props.chatData.usersAmount} участников
              </p>
            </div>
          </div>
        </div>
      </li>
    );
  } else {
    return (
      <li className="chat-item rounded-[15px] relative flex w-full items-center gap-[7px] cursor-pointer overflow-hidden">
        <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300">
          <img
            src={props.chatData.avatar || DevImage}
            onError={handleImageError}
            className="w-[60px] h-[60px] rounded-full aspect-square object-cover"
            onClick={() => {
              navigate(`/chat/${props.chatData.id}`);
            }}
          />
          <div
            className={`flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] ${
              props.underline ? "border-b-[#D9D9D9] border-b-[1px]" : ""
            }`}
          >
            <div
              className={`flex flex-col gap-[2px]`}
              onClick={() => {
                navigate(`/chat/${props.chatData.id}`);
              }}
            >
              <p className="font-normal text-[17px]">{props.chatData.name}</p>
              <p className="text-hint font-light text-[15px]">
                {props.chatData.usersAmount} участников
              </p>
            </div>
          </div>
          <img
            src={TrashBin}
            onClick={() => {
              if (props.deleteHandler) {
                props.deleteHandler();
              }
            }}
            className="w-[25px] h-[27px]"
          />
        </div>
      </li>
    );
  }
};
export default ChatPreviewComponent;
