import { useEffect, useState, useCallback } from "react";
import ProfileComponent from "../components/profile.component";
import SearchBarComponent from "../components/searchBar.component";
import { ChatPreviewData } from "../types/user.interface";
import { getMe, leaveChat, searchChats } from "../api/api";
import { initData, openTelegramLink, popup } from "@telegram-apps/sdk-react";
import ChatPreviewComponent from "../components/chatPreview.component";
import DBBComponent from "../components/disableBackButton.component";
import { Outlet } from "react-router-dom";
import useChatsSearchStore from "../stores/chatsSearch.store";
import { BOT_USERNAME } from "../shared/constants";
import useUserStore from "../stores/user.store";
import NotFound from "../assets/notFound.svg";
import AddButton from "../assets/add_green.svg";
import { motion } from "motion/react";
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const ChatsPage = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<ChatPreviewData[]>([]);
  const { searchQuery, setSearchQuery } = useChatsSearchStore();
  const userStore = useUserStore();
  const deleteHandler = async (chatPreviewData: ChatPreviewData) => {
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
          const response = await leaveChat(
            initData.raw() ?? "",
            chatPreviewData.id ?? ""
          );
          if (response) {
            setChats(chats.filter((chat) => chat.id !== chatPreviewData.id));
          }
        }
      });
  };

  const fetchChats = async (query: string) => {
    try {
      const data = await searchChats(initData.raw() ?? "", query);
      if (data) {
        setChats(data);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
    setIsLoading(false);
  };

  const fetchUserData = useCallback(async () => {
    const userData = await getMe(initData.raw() ?? "");
    if (userData) {
      userStore.updateUserData(userData);
    }
  }, []);

  useEffect(() => {
    setOpened(false);
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchChats(searchQuery);
    setOpened(true);
  }, [searchQuery]);
  return (
    <>
      <DBBComponent>
        <div className="max-w-[95%]  max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
          <div className="flex items-center mt-[25px] justify-between gap-[15px]  ">
            <div className="flex gap-[12px] items-center">
              <h1 className="text-xl font-semibold">Чаты</h1>
              <img
                className="w-[22px] h-[22px]"
                src={AddButton}
                onClick={() => {
                  openTelegramLink(`https://t.me/${BOT_USERNAME}?startgroup=`);
                }}
              />
            </div>
            <ProfileComponent />
          </div>

          <SearchBarComponent
            value={searchQuery}
            inputHandler={setSearchQuery}
            placeholder="Поиск"
            className="mt-[15px]"
          />
          {opened && (
            <ul className="flex flex-col gap-0 mt-[25px]">
              {chats.map((chat, index) =>
                index !== chats.length - 1 ? (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    underline
                    index={index}
                  />
                ) : (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    index={index}
                  />
                )
              )}
            </ul>
          )}
          {!opened && (
            <motion.ul
              className="flex flex-col gap-0 mt-[25px]"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {chats.map((chat, index) =>
                index !== chats.length - 1 ? (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    underline
                    index={index}
                    animated
                    onAnimationComplete={
                      index === chats.length - 1
                        ? () => setOpened(true)
                        : undefined
                    }
                  />
                ) : (
                  <ChatPreviewComponent
                    key={chat.id}
                    chatData={chat}
                    deleteHandler={() => deleteHandler(chat)}
                    index={index}
                    animated
                    onAnimationComplete={
                      index === chats.length - 1
                        ? () => setOpened(true)
                        : undefined
                    }
                  />
                )
              )}
            </motion.ul>
          )}
          {chats.length === 0 && !isLoading && (
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

export default ChatsPage;
