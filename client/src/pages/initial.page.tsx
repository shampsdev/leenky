import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStartParamStore from "../stores/StartData.store";

const InitialPage = () => {
  const { startParam } = useStartParamStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (startParam !== undefined && startParam.length > 0) {
      navigate("/chats", { replace: true });

      navigate(`/chat/${startParam}`);
    } else {
      navigate("/chats", { replace: true });
    }
  }, []);
  return null;
};

export default InitialPage;
