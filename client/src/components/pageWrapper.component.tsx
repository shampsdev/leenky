import { motion } from "motion/react";
interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="w-full h-full"
    >
      {props.children}
    </motion.div>
  );
};

export default PageWrapper;
