import { motion } from "framer-motion";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import NavImage from "../assets/navigation.svg";
import { Member } from "../types/member/member.interface";
import { useExtractFields } from "../hooks/utils/extractFields";

const cardVariants = {
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

const ChatMemberCardComponent = (props: {
  onClick?: () => void;
  index: number;
  animated?: boolean;
  onAnimationComplete?: () => void;
  member: Member;
}) => {
  const fields = props.member.config.fields;

  const { textInputs, textAreas } = useExtractFields(fields);

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
          <div className="flex w-full gap-[10px] items-center justify-between flex-row pb-[10px]">
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
                    {textInputs[0]}
                  </p>
                  <p className="text-hint flex items-start gap-[4px] text-[13px]">
                    {textInputs[1]}
                  </p>
                </div>
              </div>
            </div>
            <img src={NavImage} />
          </div>

          <p className="text-hint font-light text-[13px] pt-[10px]">
            {textAreas[0] && textAreas[0].length > 90
              ? textAreas[0].slice(0, 90) + "..."
              : textAreas[0]}
          </p>
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
          <div className="flex w-full gap-[10px] items-center justify-between flex-row pb-[10px]">
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
                    {textInputs[0]}
                  </p>
                  <p className="text-hint flex items-start gap-[4px] text-[13px]">
                    {textInputs[1]}
                  </p>
                </div>
              </div>
            </div>
            <img src={NavImage} />
          </div>

          <p className="text-hint font-light text-[13px] pt-[10px]">
            {textAreas[0] && textAreas[0].length > 90
              ? textAreas[0].slice(0, 90) + "..."
              : textAreas[0]}
          </p>
        </div>
      </li>
    );
  }
};

export default ChatMemberCardComponent;
