import ButtonComponent, { ButtonComponentProps } from "./button.component";

const FixedBottomButtonComponent = (props: ButtonComponentProps) => {
  return (
    <div className="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-center">
      <ButtonComponent
        content={props.content}
        handleClick={props.handleClick}
        state={props.state}
      />
    </div>
  );
};

export default FixedBottomButtonComponent;
