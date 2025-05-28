import { motion } from "motion/react";
import AutoLinkText from "./AutoLinkText";
interface InfoParagraphComponentProps {
  title: string;
  content: string;
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const InfoParagraphComponent = (props: InfoParagraphComponentProps) => {
  return (
    <motion.div variants={itemVariants} className="flex flex-col py-[12px] ">
      <p className="text-[15px] text-hint">{props.title}</p>
      <p className="text-[17px] whitespace-pre-wrap break-words">
        <AutoLinkText text={props.content} />
      </p>
    </motion.div>
  );
};
export default InfoParagraphComponent;
