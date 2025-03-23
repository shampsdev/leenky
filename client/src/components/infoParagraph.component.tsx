interface InfoParagraphComponentProps {
  title: string;
  content: string;
}
const InfoParagraphComponent = (props: InfoParagraphComponentProps) => {
  return (
    <div className="flex flex-col py-[12px] ">
      <p className="text-[15px] text-hint">{props.title}</p>
      <p className="text-[17px] whitespace-pre-wrap break-words">
        {props.content}
      </p>
    </div>
  );
};
export default InfoParagraphComponent;
