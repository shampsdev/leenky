import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import TrashBin from "../assets/trash_bin.svg";
import { motion } from "motion/react";
import { Community } from "../types/community/community.interface";
import InfoIcon from "../assets/community_info.svg";
import AutoLinkText from "./AutoLinkText";
interface ChatPreviewComponentProps {
  chatData: Community;
  view?: boolean;
  className?: string;
  underline?: boolean;
  deleteHandler?: () => void;
  onClick?: () => void;
}

const chatPreviewVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index > 10 ? index * 0.01 : 11 * 0.01,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};
const ChatPreviewComponent = (
  props: ChatPreviewComponentProps & {
    index: number;
    onAnimationComplete?: () => void;
    animated?: boolean;
  }
) => {
  if (props.view) {
    return (
      <motion.li
        variants={chatPreviewVariants}
        initial="hidden"
        animate="visible"
        custom={props.index}
        className={
          "chat-item rounded-[15px] relative flex w-full items-center gap-[7px]  overflow-hidden" +
          " " +
          props.className
        }
      >
        <div className="flex flex-col  w-full">
          <div
            className={
              props.chatData.description.length > 0
                ? "chat-content flex items-center gap-[7px] w-full transition-transform duration-300 mb-[16px]"
                : "chat-content flex items-center gap-[7px] w-full transition-transform duration-300"
            }
            onClick={props.onClick}
          >
            <div className="relative w-[60px] h-[60px] rounded-full aspect-square object-cover">
              <img
                src={props.chatData.avatar || DevImage}
                onError={handleImageError}
                className="rounded-full aspect-square object-cover"
              />
              <img
                className="absolute top-[-5px] right-[-6px] w-[28px] h-[28px]"
                src={InfoIcon}
                alt=""
              />
            </div>

            <div
              className={
                "flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px]"
              }
            >
              <div className="flex flex-col gap-[2px]">
                <p className="font-normal text-[17px]">
                  {props.chatData.name.length > 20
                    ? props.chatData.name.slice(0, 20) + "..."
                    : props.chatData.name}
                </p>
                <p className="text-hint font-light text-[15px]">
                  {props.chatData.membersCount} участников
                </p>
              </div>
            </div>
          </div>
          {props.chatData.description.length > 0 && (
            <>
              <div className="h-[1px] bg-[#D9D9D9]" />
              <p className="mt-[16px] text-[17px] text-[#707579]">
                <AutoLinkText text={props.chatData.description ?? ""} />
              </p>
            </>
          )}
        </div>
      </motion.li>
    );
  } else {
    if (props.animated) {
      return (
        <motion.li
          className="chat-item rounded-[15px] relative flex w-full items-center gap-[7px] cursor-pointer overflow-hidden"
          variants={chatPreviewVariants}
          initial="hidden"
          animate="visible"
          custom={props.index}
          onAnimationComplete={props.onAnimationComplete}
        >
          <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300">
            <img
              src={props.chatData.avatar || DevImage}
              onError={handleImageError}
              className="w-[60px] h-[60px] rounded-full aspect-square object-cover"
              onClick={props.onClick}
            />
            <div
              className={`flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] ${
                props.underline ? "border-b-[#D9D9D9] border-b-[1px]" : ""
              }`}
            >
              <div
                className={`flex flex-col gap-[2px]`}
                onClick={props.onClick}
              >
                <p className="font-normal text-[17px]">
                  {props.chatData.name.length > 20
                    ? props.chatData.name.slice(0, 20) + "..."
                    : props.chatData.name}
                </p>
                <p className="text-hint font-light text-[15px]">
                  {props.chatData.membersCount} участников
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
              className=""
            />
          </div>
        </motion.li>
      );
    }
    if (!props.animated) {
      return (
        <li className="chat-item rounded-[15px] relative flex w-full items-center gap-[7px] cursor-pointer overflow-hidden">
          <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300">
            <img
              src={props.chatData.avatar || DevImage}
              onError={handleImageError}
              className="w-[60px] h-[60px] rounded-full aspect-square object-cover"
              onClick={props.onClick}
            />
            <div
              className={`flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] ${
                props.underline ? "border-b-[#D9D9D9] border-b-[1px]" : ""
              }`}
            >
              <div
                className={`flex flex-col gap-[2px]`}
                onClick={props.onClick}
              >
                <p className="font-normal text-[17px]">
                  {props.chatData.name.length > 20
                    ? props.chatData.name.slice(0, 20) + "..."
                    : props.chatData.name}
                </p>
                <p className="text-hint font-light text-[15px]">
                  {props.chatData.membersCount} участников
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
              className=""
            />
          </div>
        </li>
      );
    }
  }
};
export default ChatPreviewComponent;
