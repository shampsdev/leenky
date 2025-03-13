import { useEffect, useState } from "react";
import ProfileComponent from "../components/profile.component";
import SearchBarComponent from "../components/searchBar.component";
import { ChatData } from "../types/user.interface";
import { searchChats } from "../api/api";
import { initDataRaw } from "@telegram-apps/sdk-react";

const ChatsPage = () => {
  const [chats, setChats] = useState<ChatData[]>();
  const [searchQuery, setSearchQuery] = useState<string>();

  const fetchChats = async () => {
    const data = await searchChats(initDataRaw() ?? "", searchQuery ?? "");
    if (data) {
      setChats(data);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [searchQuery]);
  return (
    <>
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
          inputHandler={(value) => setSearchQuery(value)}
          placeholder="Поиск"
        />
      </div>
    </>
  );
};

export default ChatsPage;
