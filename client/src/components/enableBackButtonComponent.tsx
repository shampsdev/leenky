import { backButton } from "@telegram-apps/sdk-react";

interface EBBComponentProps {
  children: React.ReactNode;
}
const EBBComponent = (props: EBBComponentProps) => {
  if (!backButton.isVisible()) {
    backButton.show();
  }
  return <>{props.children}</>;
};

export default EBBComponent;
