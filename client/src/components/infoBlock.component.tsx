import { ReactNode } from "react";

interface InfoBlockComponentProps {
  children: ReactNode;
}
const InfoBlockComponent = (props: InfoBlockComponentProps) => {
  return (
    <div className="bg-form flex flex-col gap-[10px] px-[16px] rounded-[12px] divide-y divide-[#707579]">
      {props.children}
    </div>
  );
};

export default InfoBlockComponent;
