<<<<<<< HEAD:client/src/pages/communities.page.tsx
import { useEffect, useRef, useState } from "react";
=======
import { useEffect, useState, useCallback, useRef } from "react";
import ProfileComponent from "../components/profile.component";
>>>>>>> main:client/src/pages/chats.page.tsx
import SearchBarComponent from "../components/searchBar.component";
import { popup } from "@telegram-apps/sdk-react";
import ChatPreviewComponent from "../components/chatPreview.component";
import DBBComponent from "../components/disableBackButton.component";
import { Outlet, useNavigate } from "react-router-dom";
import useChatsSearchStore from "../stores/chatsSearch.store";
import NotFound from "../assets/notFound.svg";
import AddButton from "../assets/add_green.svg";
import { motion } from "motion/react";
import useLeaveCommunity from "../hooks/communities/mutations/useLeaveCommunity";
import useCommunitiesSearch from "../hooks/communities/search/useCommunitiesSearch";
import { Community } from "../types/community/community.interface";
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
<<<<<<< HEAD:client/src/pages/communities.page.tsx
const CommunitiesPage = () => {
  const navigate = useNavigate();

  const useLeaveChatMutation = useLeaveCommunity();

  const { searchQuery, setSearchQuery, scroll, setScroll } =
    useChatsSearchStore();

  const { data: chats, isPending } = useCommunitiesSearch(searchQuery);

  const [loadedFirstTime, setLoadedFirstTime] = useState<boolean>(false);

  const goToCommunity = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

  const deleteHandler = async (chatPreviewData: Community) => {
=======
const ChatsPage = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<ChatPreviewData[]>([]);
  const { searchQuery, setSearchQuery, scroll, setScroll } =
    useChatsSearchStore();
  const userStore = useUserStore();
  const deleteHandler = async (chatPreviewData: ChatPreviewData) => {
>>>>>>> main:client/src/pages/chats.page.tsx
    popup
      .open({
        message:
          "Вы уверены, что хотите удалить свой профиль Leenky из этого чата?",
        buttons: [
          { id: "Ok", type: "ok" },
          { id: "Cancel", type: "cancel" },
        ],
      })
      .then(async (buttonId) => {
        if (buttonId === "Ok") {
          await useLeaveChatMutation.mutateAsync(chatPreviewData.id ?? "");
        }
      });
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScroll(scrollContainerRef.current.scrollTop);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scroll,
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
<<<<<<< HEAD:client/src/pages/communities.page.tsx
  }, [isPending]);
=======
  }, []);

  useEffect(() => {
    setOpened(false);
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchChats(searchQuery);
    setOpened(true);
  }, [searchQuery]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScroll(scrollContainerRef.current.scrollTop);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        console.log(scroll);
        scrollContainerRef.current.scrollTo({
          top: scroll,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading]);
>>>>>>> main:client/src/pages/chats.page.tsx
  return (
    <>
      <DBBComponent>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-w-[95%]  max-h-[100vh] overflow-auto scroll-container mx-auto px-4"
        >
          <div className="flex items-center mt-[25px] justify-between gap-[15px]  ">
            <div className="flex gap-[12px] items-center">
              <h1 className="text-xl font-semibold">Сообщества</h1>
              <img
                className="w-[22px] h-[22px]"
                src={AddButton}
                onClick={() => {
                  navigate(`/community/create/initial`);
                }}
              />
            </div>
          </div>

          <SearchBarComponent
            value={searchQuery}
            inputHandler={setSearchQuery}
            placeholder="Поиск"
            className="mt-[15px]"
          />
          {loadedFirstTime && (
            <ul className="flex flex-col gap-0 mt-[25px]">
              {chats?.map((chat, index) =>
                index !== chats.length - 1 ? (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    onClick={() => goToCommunity(chat.id)}
                    underline
                    index={index}
                  />
                ) : (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    onClick={() => goToCommunity(chat.id)}
                    index={index}
                  />
                )
              )}
            </ul>
          )}
          {!loadedFirstTime && (
            <motion.ul
              className="flex flex-col gap-0 mt-[25px]"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {chats?.map((chat, index) =>
                index !== chats.length - 1 ? (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    onClick={() => goToCommunity(chat.id)}
                    underline
                    index={index}
                    animated
                    onAnimationComplete={
                      index === chats.length - 1
                        ? () => setLoadedFirstTime(true)
                        : undefined
                    }
                  />
                ) : (
                  <ChatPreviewComponent
                    onClick={() => goToCommunity(chat.id)}
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    index={index}
                    animated
                  />
                )
              )}
            </motion.ul>
          )}

          {!chats && !isPending && (
            <div className="flex w-full flex-col items-center text-center mt-[120px] gap-[20px]">
              <img src={NotFound} />
              <div className="flex flex-col items-center text-center gap-[8px]">
                <h1 className="font-semibold text-[20px]">
                  Тут пока ничего нет
                </h1>
                <p className="text-hint text-[17px]">
                  Но вы можете исправить это! Добавьте чаты, чтобы видеть
                  информацию о других участниках
                </p>
              </div>
            </div>
          )}
        </div>
      </DBBComponent>
      <Outlet />
    </>
  );
};

export default CommunitiesPage;
