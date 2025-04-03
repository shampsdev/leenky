import { initData, initDataStartParam } from "@telegram-apps/sdk-react";
import { getChatPreview } from "../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInviteStore from "../stores/invite.store";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
  chatID?: string;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();

  const inviteStore = useInviteStore();

  const initDataRaw = initData.raw();
  let chatID = props.chatID !== undefined ? props.chatID : initDataStartParam();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMember, setIsMember] = useState<boolean>(false);

  const checkMembership = async () => {
    if (initDataStartParam() !== undefined && !inviteStore.showedOnce) {
      chatID = initDataStartParam();
      inviteStore.setShowedOnce();
    }
    const data = await getChatPreview(initDataRaw ?? "", chatID || "");
    if (data !== null && data?.isMember !== null) {
      setIsMember(data.isMember);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkMembership();
    if (!isLoading) {
      if (!isMember) {
        navigate("/invite", { replace: true });
      }
    }
  }, [isLoading, isMember]);

  if (isLoading) {
    return null;
  }

  return isMember ? <>{props.children}</> : null;
};

export default RequireMembershipComponent;
