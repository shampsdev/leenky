import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";
import useCommunity from "../hooks/communities/fetchHooks/useСommunity";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
  chatID?: string;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();
  const { initDataStartParam } = useInitDataStore();

  const chatID = props.chatID ?? initDataStartParam;
  const { isPending, isSuccess } = useCommunity(chatID || "");

  if (isPending) {
    return null;
  }

  if (!initDataStartParam || (initDataStartParam === chatID && isSuccess)) {
    return <>{props.children}</>;
  }

  navigate("/invite");
};

export default RequireMembershipComponent;
