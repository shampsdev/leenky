import { ReactNode } from "react";
import { motion } from "motion/react";
interface InfoBlockComponentProps {
  children: ReactNode;
  className?: string;
}
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const InfoBlockComponent = (props: InfoBlockComponentProps) => {
  return (
    <motion.div
      className={`bg-form flex flex-col py-[2px] px-[16px] rounded-[12px] divide-y divide-[#D9D9D9] ${props.className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {props.children}
    </motion.div>
  );
};

export default InfoBlockComponent;
