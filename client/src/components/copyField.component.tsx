import CopyIcon from "../assets/copy_icon.svg";
export interface CopyFieldComponentProps {
  content: string;
  link?: boolean;
}
const CopyFieldComponent = ({ content, link }: CopyFieldComponentProps) => {
  return (
    <div className="flex flex-row gap-[10px] py-[12px] px-[16px] border-[2px] rounded-[14px] border-[#F5F5F5] text-black text-[17px]">
      <p className="flex-1">
        {link ? (
          <a href={content}>
            {content.length > 30 ? content.slice(0, 30) + "..." : content}
          </a>
        ) : (
          content
        )}
      </p>
      <img
        src={CopyIcon}
        alt=""
        className="cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(content);
        }}
      />
    </div>
  );
};

export default CopyFieldComponent;
