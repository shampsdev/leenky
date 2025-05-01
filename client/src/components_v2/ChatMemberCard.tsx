import { getUserById } from "../api/api";
import { UserData } from "../types/user.interface";
import { useNavigate } from "react-router-dom";
import { initData } from "@telegram-apps/sdk-react";
import { useQuery } from "@tanstack/react-query";

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

const ChatMemberCard = (
  props: UserData & {
    index: number;
    animated?: boolean;
    onAnimationComplete?: () => void;
  },
) => {
  const navigate = useNavigate();
  const userData = useQuery<UserData>(`use`, () =>
    getUserById(initData.raw() ?? "", props.id ?? ""),
  );
};

export default ChatMemberCard;
