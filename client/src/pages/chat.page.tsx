import { useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import RequireMembershipComponent from "../components/requireMembership.component";

const ChatPage = () => {
  const { chatId } = useParams();
  return (
    <EBBComponent>
      <RequireMembershipComponent chatID={chatId}>
        ChatPage <br />
      </RequireMembershipComponent>
    </EBBComponent>
  );
};

export default ChatPage;
