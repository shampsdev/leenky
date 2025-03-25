export type ButtonState = "active" | "disabled";
export interface ButtonComponentProps {
  content: React.ReactNode;
  handleClick: () => void;
  state: "active" | "disabled" | "previewMessage";
}
const ButtonComponent = (props: ButtonComponentProps) => {
  const activeButtonStyle =
    "bg-[#20C86E] rounded-[30px] text-white font-semibold";

  const disabledButtonStyle = "bg-form rounded-[30px] text-main font-semibold";

  const previewMessageUserStyle =
    "bg-[#20C86E] rounded-[10px] text-white font-semibold px-[30px] py-[6px]";
  if (props.state === "active") {
    return (
      <button
        className={`flex items-center gap-[7px] ${activeButtonStyle} px-[30px] py-[12px] z-10 `}
        onClick={() => props.handleClick()}
      >
        {props.content}
      </button>
    );
  } else if (props.state === "disabled") {
    return (
      <button
        onClick={() => props.handleClick()}
        className={`${disabledButtonStyle} px-[30px] py-[12px] z-10 `}
      >
        {props.content}
      </button>
    );
  } else if (props.state === "previewMessage") {
    return (
      <button
        className={`flex items-center gap-[7px] ${previewMessageUserStyle} px-[30px] py-[6px] z-10 `}
        onClick={() => props.handleClick()}
      >
        {props.content}
      </button>
    );
  }
};

export default ButtonComponent;
