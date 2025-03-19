export interface InputFieldComponentProps {
  onChangeFunction: (value: string) => void;
  title: string;
  value: string;
  maxLength: number;
}
const InputFieldComponent = (props: InputFieldComponentProps) => {
  return (
    <section>
      <fieldset className="border-2 rounded-xl px-3 relative transition-all duration-100 focus-within:border-[#20C86E] focus-within:text-[#20C86E] border-gray-300 text-gray-400">
        <legend className="px-2 text-[15px] font-semibold transition-all duration-100">
          {props.title}
        </legend>
        <input
          onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            props.onChangeFunction(event.target.value)
          }
          type="text"
          value={props.value}
          maxLength={props.maxLength}
          className="w-full text-main outline-none pb-[12px] py-[3px] px-[16px] bg-transparent"
        />
      </fieldset>
    </section>
  );
};

export default InputFieldComponent;
