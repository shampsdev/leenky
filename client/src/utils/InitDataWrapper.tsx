import { useEffect } from "react";
import useInitDataStore from "../stores/InitData.store";

const InitDataWrapper = ({ children }: { children: React.ReactNode }) => {
  const { initialize, initialized } = useInitDataStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) return null;

  return <>{children}</>;
};

export default InitDataWrapper;
