import { initData, initDataStartParam } from "@telegram-apps/sdk-react";
import { getChatPreview } from "../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RequireMembershipComponentProps {
  children: React.ReactNode;
}
const RequireMembershipComponent = (props: RequireMembershipComponentProps) => {
  const navigate = useNavigate();
  const initDataRaw = initData.raw();
  const chatID = initDataStartParam() || "";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMember, setIsMember] = useState<boolean>(false);
  const checkMembership = async () => {
    const data = await getChatPreview(initDataRaw ?? "", chatID);
    if (data) {
      setIsMember(data.isMember ?? false);
    }
    setIsLoading(false);
    if (!isMember) {
      navigate("/invite", { replace: true });
    }
  };

  useEffect(() => {
    checkMembership();
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  return isMember ? <>{props.children}</> : null;
};

export default RequireMembershipComponent;
