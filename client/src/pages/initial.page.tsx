import { initDataStartParam } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/user.store";

const InitialPage = () => {
  const startData = initDataStartParam();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated && startData !== undefined && startData.length > 0) {
      navigate("/chats", { replace: true });

      navigate(`/chats/${startData}`);
    } else if (isAuthenticated) {
      navigate("/chats", { replace: true });
    } else {
      navigate("/about/1", { replace: true });
    }
  }, []);
  return <>Initial</>;
};

export default InitialPage;
