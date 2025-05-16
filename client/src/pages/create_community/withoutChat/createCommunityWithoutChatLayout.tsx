import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
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

  const [maxVisited, setMaxVisited] = useState(activeIndex);

  useEffect(() => {
    setMaxVisited((prev) => Math.max(prev, activeIndex));
  }, [activeIndex]);

  const barTransition = { duration: 0.4, ease: "easeInOut" };

  return (
    <div className="max-w-[95%] max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
      {!location.pathname.startsWith("/community/create/initial") && (
        <div className="flex flex-row items-center gap-2 mb-4">
          <div className="w-full bg-[#F5F5F5] rounded-[10px] h-[8px] dark:bg-[#F5F5F5] overflow-hidden">
            <div className="bg-[#20C86E] h-[8px] rounded-[10px] dark:bg-[#20C86E]"></div>

            <div className="bg-[#20C86E] h-[8px] rounded-[10px] dark:bg-[#20C86E]" />
          </div>
          {steps.map((_, index) => (
            <div
              key={index}
              className="w-full bg-[#F5F5F5] rounded-[10px] h-[8px] overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {index < activeIndex && (
                  <div
                    className="bg-[#20C86E] h-full rounded-[10px]"
                    style={{ width: "100%" }}
                  />
                )}

                {index === activeIndex && (
                  <motion.div
                    key="active"
                    className="bg-[#20C86E] h-full rounded-[10px]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={barTransition}
                  />
                )}

                {index > activeIndex && index > maxVisited && (
                  <motion.div
                    key="future"
                    className="bg-[#20C86E] h-full rounded-[10px]"
                    initial={{ width: 0 }}
                    animate={{ width: 0 }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default CreateCommunityWithoutChatLayout;
