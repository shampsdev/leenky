import { useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import RequireMembershipComponent from "../components/requireMembership.component";
import SearchBarComponent from "../components/searchBar.component";
import ChatPreviewComponent from "../components/chatPreview.component";
import { getChat, getChatPreview, searchInChat } from "../api/api";
import { initData } from "@telegram-apps/sdk-react";
import { ChatData, ChatPreviewData } from "../types/user.interface";
import { useEffect, useState } from "react";
import useChatSearchStore from "../stores/chatSearch.store";
import ChatMemberCardComponent from "../components/chatMember.card.component";
import { motion } from "motion/react";

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const ChatPage = () => {
  const { chatId } = useParams();

  const { searchQuery, setSearchQuery, chatID, setChatID } =
    useChatSearchStore();

  const [loading, isLoading] = useState<boolean>(true);

  const [chatData, setChatData] = useState<ChatData>({
    name: null,
    id: chatId ?? "",
    avatar: null,
    telegramId: "",
    users: [],
  });

  const [previewChatData, setPreviewChatData] = useState<ChatPreviewData>({
    avatar: null,
    usersAmount: null,
    name: null,
    id: chatId ?? "",
    telegramId: "",
    isMember: null,
  });

  const fetchChatPreview = async () => {
    const chatData = await getChatPreview(initData.raw() ?? "", chatId ?? "");
    if (chatData) {
      setPreviewChatData(chatData);
    }
    isLoading(false);
  };

  const fetchChatData = async () => {
    const chatData = await getChat(initData.raw() ?? "", chatId ?? "");
    if (chatData) {
      setChatData(chatData);
    }
  };

  const searchUsers = async () => {
    const searchResponse = await searchInChat(
      initData.raw() ?? "",
      chatId ?? "",
      searchQuery
    );
    if (searchResponse) {
      setChatData({ ...chatData, users: searchResponse });
    }
  };

  useEffect(() => {
    if (chatId !== chatID) {
      setChatID(chatId ?? "");
      setSearchQuery("");
    }
    fetchChatPreview();
    if (previewChatData.isMember) {
      fetchChatData();
    }
  }, [chatId]);

  useEffect(() => {
    if (previewChatData.isMember) {
      searchUsers();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (previewChatData.isMember) {
      searchUsers();
    }
  }, [loading]);

  return (
    <EBBComponent>
      <RequireMembershipComponent chatID={chatId}>
        <div className="max-w-[95%]  max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
          <ChatPreviewComponent
            chatData={previewChatData}
            view={true}
            className=" mt-[25px]"
          />
          <SearchBarComponent
            value={searchQuery}
            inputHandler={setSearchQuery}
            placeholder="Поиск участников"
            className="mt-[20px]"
          />

          <motion.ul
            className="flex flex-col gap-[12px] mt-[25px]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {chatData.users.map((user, index) => (
              <ChatMemberCardComponent
                index={index}
                key={user.id}
                userData={user}
              />
            ))}
          </motion.ul>
        </div>
      </RequireMembershipComponent>
    </EBBComponent>
  );
};

export default ChatPage;
