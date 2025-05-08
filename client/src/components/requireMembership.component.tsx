import { useEffect } from "react";
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

  useEffect(() => {
    if (!isPending && data && !data.isMember) {
      navigate("/invite");
    }
  }, [isPending, data, navigate]);

  if (isPending || (data && !data.isMember)) {
    return null;
  }

  return <>{props.children}</>;
};

export default RequireMembershipComponent;
