interface aboutComponentProps {
  handleButtonClick: () => void;
  imageSrc: string;
  contentText: string;
  buttonText: string;
}

const AboutComponent = (props: aboutComponentProps) => {
  return (
    <div className="screen-container">
      <div>
        <div className="flex flex-col items-center justify-center text-center h-[95vh] max-w-[90%] mx-auto overflow-auto">
          <div className="w-full max-w-[320px] flex items-center justify-center rounded-lg mt-[20px]">
            <img src={props.imageSrc} alt="About" />
          </div>

          <div className="mt-6" v-if="isLoaded">
            <p className="text-[20px] mt-2 text-main font-semibold">
              {props.contentText}
            </p>
          </div>
        </div>

        <div className="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-center">
          <button
            onClick={() => props.handleButtonClick()}
            className="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
          >
            {props.buttonText}
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
