import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInitDataStore from "../stores/InitData.store";

const InitialPage = () => {
  const { initDataStartParam: startParam, initData } = useInitDataStore();
  const navigate = useNavigate();
  console.log(initData);
  useEffect(() => {
    if (
      startParam !== undefined &&
      startParam !== null &&
      startParam.length > 0
    ) {
      navigate("/communities");
      navigate(`/community/${startParam}`);
    } else {
      navigate("/communities");
    }
  }, []);

  return null;
};

export default InitialPage;
