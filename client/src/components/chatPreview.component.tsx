import { ChatPreviewData } from "../types/user.interface";
import { handleImageError } from "../utils/imageErrorHandler";

interface ChatPreviewComponentProps {
  chatData: ChatPreviewData;
}
const ChatPreviewComponent = (props: ChatPreviewComponentProps) => {
  return (
    <li className="chat-item rounded-[15px] relative flex w-full items-center gap-[7px] cursor-pointer overflow-hidden">
      <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300">
        <img
          src={props.chatData.avatar ?? ""}
          onError={handleImageError}
          className="w-[60px] h-[60px] rounded-full aspect-square object-cover"
        />
        <div className="flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-normal text-[17px]">{props.chatData.name}</p>
            <p className="text-hint font-light text-[15px]">
              {props.chatData.usersAmount} участников
            </p>
          </div>
          <img
            src="/src/assets/navigation.svg"
            className="text-gray-400 pr-[5px] text-xl"
          />
        </div>
      </div>
    </li>
  );
};
export default ChatPreviewComponent;
