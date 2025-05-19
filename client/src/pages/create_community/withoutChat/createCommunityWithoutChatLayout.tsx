import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";

const CreateCommunityWithoutChatLayout = () => {
  const location = useLocation();

  const steps = [
    "/community/create/without_chat/description",
    "/community/create/without_chat/profile",
  ];

  const activeIndex = steps.findIndex((step) =>
    location.pathname.startsWith(step)
  );

  return (
    <div className="max-w-[95%]   overflow-auto scroll-container mx-auto px-4">
      <AnimatePresence mode="wait">
        {!location.pathname.startsWith("/community/create/initial") && (
          <div className="flex flex-row items-center gap-2 mb-4 py-[16px]">
            <div className="w-full bg-[#F5F5F5] rounded-[10px] h-[8px] dark:bg-[#F5F5F5] overflow-hidden">
              <div className="bg-[#20C86E] h-[8px] rounded-[10px] dark:bg-[#20C86E]"></div>

              <div className="bg-[#20C86E] h-[8px] rounded-[10px] dark:bg-[#20C86E]" />
            </div>

            {steps.map((_, index) => (
              <div
                key={index}
                className="w-full bg-[#F5F5F5] rounded-[10px] h-[8px] dark:bg-[#F5F5F5] overflow-hidden"
              >
                {index < activeIndex && (
                  <div className="bg-[#20C86E] h-[8px] rounded-[10px] dark:bg-[#20C86E]"></div>
                )}
                {index >= activeIndex && (
                  <motion.div
                    className="bg-[#20C86E] h-[8px] rounded-[10px] dark:bg-[#20C86E]"
                    initial={{ width: 0 }}
                    animate={{
                      width: index <= activeIndex ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
      <Outlet />
    </div>
  );
};

export default CreateCommunityWithoutChatLayout;
