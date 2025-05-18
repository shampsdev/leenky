interface aboutComponentProps {
  handleButtonClick: () => void;
  imageSrc: string;
  contentText: string;
  buttonText: string;
  politics?: boolean;
  cancelButtonText?: string;
  handleCancelButtonClick?: () => void;
  onPolicyClick?: () => void;
}

const AboutComponent = (props: aboutComponentProps) => {
  return (
    <div className="screen-container">
      <div>
        <div className="flex flex-col items-center justify-center text-center h-[95vh] max-w-[90%] mx-auto overflow-auto">
          <div className="w-full max-w-[320px] flex items-center justify-center rounded-lg mt-[20px]">
            <img src={props.imageSrc} alt="About" />
          </div>

          <div className="mt-6">
            <p className="text-[20px] mt-2 text-main font-semibold">
              {props.contentText}
            </p>
          </div>

          {props.politics && (
            <div className="mt-[16px] text-center text-[#707579]">
              выбирая вариант «Принимаю»,вы соглашаетесь с положениями{" "}
              <a
                onClick={props.onPolicyClick}
                className="font-semibold underline cursor-pointer"
              >
                политики конфиденциальности
              </a>
            </div>
          )}
        </div>

        <div className="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-evenly">
          {props.cancelButtonText && (
            <button
              onClick={props.handleCancelButtonClick}
              className="px-[30px] bg-[#F5F5F5] py-[12px] z-10 bg-[#] rounded-[30px] text-black font-semibold"
            >
              {props.cancelButtonText}
            </button>
          )}
          <button
            onClick={() => props.handleButtonClick()}
            className="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
          >
            {props.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
