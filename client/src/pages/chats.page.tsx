import { useEffect, useState, useCallback } from "react";
import ProfileComponent from "../components/profile.component";
import SearchBarComponent from "../components/searchBar.component";
import { ChatPreviewData } from "../types/user.interface";
import { searchChats } from "../api/api";
import { initData } from "@telegram-apps/sdk-react";
import ChatPreviewComponent from "../components/chatPreview.component";
import DBBComponent from "../components/disableBackButton.component";
import { Outlet } from "react-router-dom";
import useChatsSearchStore from "../stores/chatsSearch.store";

const ChatsPage = () => {
  const [chats, setChats] = useState<ChatPreviewData[]>([]);
  const { searchQuery, setSearchQuery } = useChatsSearchStore();

  const fetchChats = useCallback(async (query: string) => {
    try {
      const data = await searchChats(initData.raw() ?? "", query);
      console.log(data);
      if (data) {
        setChats(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  }, []);

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
              <ChatPreviewComponent key={chat.id} chatData={chat} />
            ))}
          </ul>
        </div>
      </DBBComponent>
      <Outlet />
    </>
  );
};

export default ChatsPage;
