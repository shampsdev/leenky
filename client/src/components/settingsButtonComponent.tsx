import NavImage from "../assets/navigation.svg";

interface SettingsButtonComponentProps {
  onClick: () => void;
  content: string;
}
const SettingsButtonComponent = ({
  onClick,
  content,
}: SettingsButtonComponentProps) => {
  return (
    <div
      onClick={() => onClick()}
      className="flex rounded-[20px] py-[24px] px-[24px] gap-[10px] bg-[#F5F5F5] items-center justify-between flex-row"
    >
      <div className="flex-1">{content}</div>
      <img src={NavImage} />
    </div>
  );
};

export default SettingsButtonComponent;
