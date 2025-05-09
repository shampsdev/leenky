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
  const { isSuccess, isPending, data, isRefetching } = useCommunityPreview(
    chatID || ""
  );

  useEffect(() => {
    if (!isRefetching && isSuccess && !data?.isMember) {
      navigate("/invite");
    }
  }, [isSuccess, data]);

  if (isPending || (data && !data.isMember)) {
    return null;
  }

  return <>{props.children}</>;
};

export default RequireMembershipComponent;
