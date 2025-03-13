import { handleImageError } from "../utils/imageErrorHandler";

interface chatHeaderComponentProps {
  avatar: string;
  name: string;
  usersAmount: number;
}
const ChatHeaderComponent = (props: chatHeaderComponentProps) => {
  return (
    <header className="flex items-center space-x-4 py-4">
      <li className="flex w-full flex-row items-center gap-[7px] cursor-pointer">
        <img
          src={props.avatar}
          onError={handleImageError}
          className="w-[68px] h-[68px] rounded-full aspect-square object-cover"
        />
        <div className="flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] border-b-[#c8d4d9]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-normal text-[17px]">
              {props.name ?? "  название чата "}
            </p>
            <p className="text-hint font-light text-[15px]">
              {props.usersAmount ?? "0"} участников
            </p>
          </div>
        </div>
      </li>
    </header>
  );
};

export default ChatHeaderComponent;
