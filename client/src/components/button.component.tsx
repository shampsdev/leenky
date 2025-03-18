export type ButtonState = "active" | "disabled";
export interface ButtonComponentProps {
  content: string;
  handleClick: () => void;
  state: "active" | "disabled";
}
const ButtonComponent = (props: ButtonComponentProps) => {
  const activeButtonStyle =
    "bg-[#20C86E] rounded-[30px] text-white font-semibold";

  const disabledButtonStyle = "bg-form rounded-[30px] text-main font-semibold";

  if (props.state === "active") {
    return (
      <button
        className={`${activeButtonStyle} px-[30px] py-[12px] z-10 `}
        onClick={() => props.handleClick()}
      >
        {props.content}
      </button>
    );
  } else if (props.state === "disabled") {
    return (
      <button
        className={`${disabledButtonStyle} px-[30px] py-[12px] z-10 `}
        disabled
      >
        {props.content}
      </button>
    );
  }
};

export default ButtonComponent;
