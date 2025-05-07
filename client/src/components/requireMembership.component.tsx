import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";
import { useEffect } from "react";
import useCommunity from "../hooks/communities/fetchHooks/useСommunity";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
  chatID?: string;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();
  const { initDataStartParam } = useInitDataStore();

  const chatID = props.chatID ?? initDataStartParam;
  const { isPending, data } = useCommunity(chatID || "");

  useEffect(() => {
    if (!isPending && data) {
      navigate("/invite", { replace: true });
    }
  }, [isPending, data, navigate]);

  if (isPending || !data) {
    return null;
  }

  return <>{props.children}</>;
};

export default RequireMembershipComponent;
