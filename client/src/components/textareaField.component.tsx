import { InputFieldComponentProps } from "./inputField.component";

const TextareaFieldComponent = (props: InputFieldComponentProps) => {
  const isEmpty = props.value.trim() === "";
  const limitNewlines = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value;
    const newlines = (value.match(/\n/g) || []).length;

    if (event.key === "Enter" && newlines >= 6) {
      event.preventDefault();
    }
  };

  return (
    <section>
      <fieldset
        className={
          isEmpty
            ? "border-2 rounded-xl p-3 relative  border-red-500 text-red-500"
            : "border-2 rounded-xl p-3 relative border-gray-300 focus-within:border-[#20C86E] focus-within:text-[#20C86E] text-gray-400"
        }
      >
        <legend className="px-2 text-sm">{props.title}</legend>
        <textarea
          value={props.value}
          onChange={(event) => props.onChangeFunction(event.target.value)}
          onKeyDown={limitNewlines}
          maxLength={props.maxLength}
          rows={6}
          style={{ whiteSpace: "pre-wrap" }}
          className="resize-none w-full text-main outline-none pb-[6px] py-[3px] px-[16px] bg-transparent"
        ></textarea>
      </fieldset>
    </section>
  );
};

export default TextareaFieldComponent;
