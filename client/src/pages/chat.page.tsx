import { useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";

const ChatPage = () => {
  const { chatId } = useParams();

  return (
    <EBBComponent>
      ChatPage <br />
      {chatId}
    </EBBComponent>
  );
};

export default ChatPage;
