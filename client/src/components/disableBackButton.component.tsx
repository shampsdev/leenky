import { backButton } from "@telegram-apps/sdk-react";

interface DBBComponentProps {
  children: React.ReactNode;
}
const DBBComponent = (props: DBBComponentProps) => {
  if (backButton.isVisible()) {
    backButton.hide();
  }
  return <>{props.children}</>;
};

export default DBBComponent;
