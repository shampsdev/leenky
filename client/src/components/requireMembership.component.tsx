import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";
import useChatPreview from "../hooks/useChatPreview";
import { useEffect } from "react";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
  chatID?: string;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();
  const { initDataStartParam } = useInitDataStore();

  const chatID = props.chatID ?? initDataStartParam;
  const { isPending, data } = useChatPreview(chatID || "");

  useEffect(() => {
    if (!isPending && data && data.isMember === false) {
      navigate("/invite", { replace: true });
    }
  }, [isPending, data, navigate]);

  if (isPending || !data || data.isMember === false) {
    return null;
  }

  return <>{props.children}</>;
};

export default RequireMembershipComponent;
