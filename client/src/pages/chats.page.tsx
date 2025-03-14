import { useEffect, useState, useCallback } from "react";
import ProfileComponent from "../components/profile.component";
import SearchBarComponent from "../components/searchBar.component";
import { ChatData } from "../types/user.interface";
import { searchChats } from "../api/api";
import { backButton, initData } from "@telegram-apps/sdk-react";
import ChatPreviewComponent from "../components/chatPreview.component";

const ChatsPage = () => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchChats = useCallback(async (query: string) => {
    try {
      const data = await searchChats(initData.raw() ?? "", query);
      if (data) {
        setChats(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setChats([]);
      return;
    }
    fetchChats(searchQuery);
  }, [searchQuery]);
  backButton.hide();
  return (
    <div className="max-w-[95%] max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
      <div className="flex items-center justify-between gap-[15px] py-4 pt-[25px]">
        <div className="flex gap-[12px] items-center">
          <h1 className="text-xl font-semibold">Чаты</h1>
          <img className="w-[22px] h-[22px]" src="/src/assets/add_green.svg" />
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
  );
};

export default ChatsPage;
