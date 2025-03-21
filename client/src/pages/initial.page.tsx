import { initDataStartParam } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InitialPage = () => {
  const startData = initDataStartParam();
  const navigate = useNavigate();

  useEffect(() => {
    if (startData !== undefined && startData.length > 0) {
      navigate("/chats", { replace: true });

      navigate(`/chat/${startData}`);
    } else {
      navigate("/chats", { replace: true });
    }
  }, []);
  return null;
};

export default InitialPage;
