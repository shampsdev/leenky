import { ReactNode } from "react";

interface InfoBlockComponentProps {
  children: ReactNode;
  className?: string;
}
const InfoBlockComponent = (props: InfoBlockComponentProps) => {
  return (
    <div
      className={`bg-form flex flex-col py-[2px] px-[16px] rounded-[12px] divide-y divide-[#D9D9D9] ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default InfoBlockComponent;
