import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";
import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
  chatID?: string;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();
  const { initDataStartParam } = useInitDataStore();

  const chatID = props.chatID ?? initDataStartParam;
  const { isPending, data } = useCommunityPreview(chatID || "");

  if (isPending) {
    return null;
  }

  if (data?.isMember) {
    return <>{props.children}</>;
  }

  navigate("/invite");
};

export default RequireMembershipComponent;
