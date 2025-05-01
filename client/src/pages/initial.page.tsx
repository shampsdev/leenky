import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";

const InitialPage = () => {
  const { initDataStartParam: startParam } = useInitDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      startParam !== undefined &&
      startParam !== null &&
      startParam.length > 0
    ) {
      navigate("/chats", { replace: true });
      navigate(`/chat/${startParam}`);
    } else {
      navigate("/chats", { replace: true });
    }
  }, []);
  return null;
};

export default InitialPage;
