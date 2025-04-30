import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";
import useChatPreview from "../hooks/useChatPreview";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
  chatID?: string;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();
  const { initDataStartParam } = useInitDataStore();

  const chatID = props.chatID !== undefined ? props.chatID : initDataStartParam;

  const { isPending, data } = useChatPreview(chatID || "");

  if (isPending) {
    return null;
  }

  if (!isPending) {
    if (!data?.isMember) {
      navigate("/invite", { replace: true });
    }
  }

  return <>{props.children}</>;
};

export default RequireMembershipComponent;
