import { motion } from "framer-motion";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import NavImage from "../assets/navigation.svg";
import { Member } from "../types/member/member.interface";
import { Field } from "../types/fields/field.interface";
import extractFields from "../utils/extractFields";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: () => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 11 * 0.01,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const ChatMemberCardComponent = (props: {
  onClick?: () => void;
  index: number;
  animated?: boolean;
  onAnimationComplete?: () => void;
  member: Member;
  fieldsOrder: Field[];
}) => {
  const fields = props.member.config.fields;

  if (!fields) {
    return null;
  }
  const { textArea, firstTextInput, secondTextInput } = extractFields(
    fields,
    props.fieldsOrder
  );

  if (props.animated) {
    return (
      <motion.li
        className="relative rounded-[18px] flex flex-col w-full items-center cursor-pointer overflow-hidden"
        onClick={props.onClick}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={props.index}
        onAnimationComplete={props.onAnimationComplete}
      >
        <div className="bg-form flex flex-col px-[10px] rounded-[12px] divide-y divide-[#D9D9D9] w-full py-[15px]">
          <div
            className={
              textArea.length > 0
                ? `flex w-full gap-[10px] items-center justify-between flex-row pb-[10px]`
                : `flex w-full gap-[10px] items-center justify-between flex-row `
            }
          >
            <img
              src={props.member.user.avatar || DevImage}
              onError={handleImageError}
              className="w-[70px] h-[70px] rounded-full aspect-square object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-col w-[90%]">
                <p className="font-normal text-[17px]">
                  {props.member.user.firstName} {props.member.user.lastName}
                </p>
                <div className="flex flex-col">
                  <p className="text-hint flex items-start gap-[4px] text-[13px]">
                    {firstTextInput}
                  </p>
                  <p className="text-hint flex items-start gap-[4px] text-[13px]">
                    {secondTextInput}
                  </p>
                </div>
              </div>
            </div>
            <img src={NavImage} />
          </div>

          {textArea.length > 0 && (
            <p className="text-hint font-light text-[13px] pt-[10px]">
              {textArea.length > 90 ? textArea.slice(0, 90) + "..." : textArea}
            </p>
          )}
        </div>
      </motion.li>
    );
  }
  if (!props.animated) {
    return (
      <li
        className="relative rounded-[18px] flex flex-col w-full items-center cursor-pointer overflow-hidden"
        onClick={props.onClick}
      >
        <div className="bg-form flex flex-col px-[10px] rounded-[12px] divide-y divide-[#D9D9D9] w-full py-[15px]">
          <div
            className={
              textArea!.length > 0
                ? `flex w-full gap-[10px] items-center justify-between flex-row pb-[10px]`
                : `flex w-full gap-[10px] items-center justify-between flex-row `
            }
          >
            <img
              src={props.member.user.avatar || DevImage}
              onError={handleImageError}
              className="w-[70px] h-[70px] rounded-full aspect-square object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-col w-[90%]">
                <p className="font-normal text-[17px]">
                  {props.member.user.firstName} {props.member.user.lastName}
                </p>
                <div className="flex flex-col">
                  <p className="text-hint flex items-start gap-[4px] text-[13px]">
                    {firstTextInput}
                  </p>
                  <p className="text-hint flex items-start gap-[4px] text-[13px]">
                    {secondTextInput}
                  </p>
                </div>
              </div>
            </div>
            <img src={NavImage} />
          </div>

          {textArea!.length > 0 && (
            <p className="text-hint font-light text-[13px] pt-[10px]">
              {textArea!.length > 90
                ? textArea!.slice(0, 90) + "..."
                : textArea}
            </p>
          )}
        </div>
      </li>
    );
  }

  return null;
};

export default ChatMemberCardComponent;
