import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams();

  return (
    <>
      ChatPage <br />
      {chatId}
    </>
  );
};

export default ChatPage;
