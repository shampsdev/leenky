import { useEffect, useState, useCallback } from "react";
import ProfileComponent from "../components/profile.component";
import SearchBarComponent from "../components/searchBar.component";
import { ChatPreviewData } from "../types/user.interface";
import { leaveChat, searchChats } from "../api/api";
import { initData, openTelegramLink, popup } from "@telegram-apps/sdk-react";
import ChatPreviewComponent from "../components/chatPreview.component";
import DBBComponent from "../components/disableBackButton.component";
import { Outlet } from "react-router-dom";
import useChatsSearchStore from "../stores/chatsSearch.store";
import { BOT_USERNAME } from "../shared/constants";

const ChatsPage = () => {
  const [chats, setChats] = useState<ChatPreviewData[]>([]);
  const { searchQuery, setSearchQuery } = useChatsSearchStore();

  const deleteHandler = async (chatPreviewData: ChatPreviewData) => {
    popup
      .open({
        message: "Вы уверены, что хотите покинуть чат?",
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
      console.log(data);
      if (data) {
        setChats(data);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  };

  useEffect(() => {
    fetchChats(searchQuery);
  }, [searchQuery]);
  return (
    <>
      <DBBComponent>
        <div className="max-w-[95%] max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
          <div className="flex items-center justify-between gap-[15px] py-4 pt-[25px]">
            <div className="flex gap-[12px] items-center">
              <h1 className="text-xl font-semibold">Чаты</h1>
              <img
                className="w-[22px] h-[22px]"
                src="/src/assets/add_green.svg"
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
          />

          <ul className="flex flex-col gap-0 mt-[25px]">
            {chats.map((chat) => (
              <ChatPreviewComponent
                key={chat.id}
                chatData={chat}
                deleteHandler={() => deleteHandler(chat)}
              />
            ))}
          </ul>
        </div>
      </DBBComponent>
      <Outlet />
    </>
  );
};

export default ChatsPage;
