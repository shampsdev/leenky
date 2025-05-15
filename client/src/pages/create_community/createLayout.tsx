import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const CreateCommunityLayout = () => {
  const location = useLocation();

  const steps = [
    "/community/create/initial",
    "/community/create/with_chat",
    "/community/create/without_chat",
  ];

  const activeIndex = steps.findIndex((step) =>
    location.pathname.startsWith(step)
  );

  return (
    <>
      {!location.pathname.startsWith("/community/create/initial") && (
        <div className="flex flex-row items-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden"
            >
              {index < activeIndex && (
                <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"></div>
              )}
              {index >= activeIndex && (
                <motion.div
                  className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
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

      <Outlet />
    </>
  );
};

export default CreateCommunityLayout;
