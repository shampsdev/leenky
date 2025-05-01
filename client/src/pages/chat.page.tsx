import { useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import RequireMembershipComponent from "../components/requireMembership.component";
import SearchBarComponent from "../components/searchBar.component";
import ChatPreviewComponent from "../components/chatPreview.component";
import { useEffect, useRef, useState } from "react";
import useChatSearchStore from "../stores/chatSearch.store";
import ChatMemberCardComponent from "../components/chatMember.card.component";
import { motion } from "motion/react";
import NotFound from "../assets/notFound.svg";
import useSearchUsersInChat from "../hooks/useSearchUsers";
import useChatPreview from "../hooks/useChatPreview";
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const ChatPage = () => {
  const { chatId } = useParams();
  const [loadedFirstTime, setLoadedFirstTime] = useState<boolean>(false);

  const { getScroll, saveScroll, getSearchQuery, saveSearchQuery } =
    useChatSearchStore();

  const { data: chatData, isPending } = useSearchUsersInChat(
    chatId ?? "",
    getSearchQuery(chatId ?? ""),
  );
  const { data: previewChatData, isSuccess } = useChatPreview(chatId ?? "");

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      saveScroll(chatId ?? "", scrollContainerRef.current.scrollTop);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: getScroll(chatId ?? ""),
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPending]);

  useEffect(() => {
    if (!isPending) {
      setLoadedFirstTime(true);
    }
  }, [isPending]);

  return (
    <EBBComponent>
      <RequireMembershipComponent chatID={chatId}>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-w-[95%]  max-h-[100vh] overflow-auto scroll-container mx-auto px-4"
        >
          {isSuccess && (
            <ChatPreviewComponent
              chatData={previewChatData!}
              view={true}
              className=" mt-[25px]"
              index={0}
            />
          )}

          <SearchBarComponent
            value={getSearchQuery(chatId ?? "")}
            inputHandler={(value) => saveSearchQuery(chatId ?? "", value)}
            placeholder="Поиск участников"
            className="mt-[20px]"
          />
          {loadedFirstTime && (
            <ul className="flex flex-col gap-[12px] mt-[25px]">
              {chatData?.map((user, index) => (
                <ChatMemberCardComponent
                  index={index}
                  key={user.id}
                  userData={user}
                />
              ))}
            </ul>
          )}
          {!loadedFirstTime && (
            <motion.ul
              className="flex flex-col gap-[12px] mt-[25px]"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {chatData?.map((user, index) => (
                <ChatMemberCardComponent
                  animated
                  index={index}
                  key={user.id}
                  userData={user}
                  onAnimationComplete={
                    index === chatData.length - 1
                      ? () => setLoadedFirstTime(true)
                      : undefined
                  }
                />
              ))}
            </motion.ul>
          )}
          {!chatData && !isPending && (
            <div className="flex w-full flex-col items-center text-center mt-[120px] gap-[20px]">
              <img src={NotFound} />

              <div className="flex flex-col items-center text-center gap-[8px]">
                <h1 className="font-semibold text-[20px]">Ничего не найдено</h1>
              </div>
            </div>
          )}
        </div>
      </RequireMembershipComponent>
    </EBBComponent>
  );
};

export default ChatPage;
