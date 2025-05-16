export interface StepProps {
  stepNumber: number;
  value: string;
}
const StepComponent = ({ stepNumber, value }: StepProps) => {
  return (
    <div className="flex gap-[16px] items-start flex-row">
      <div className="flex-shrink-0 flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#20C86E]/20 text-[#20C86E]">
        {stepNumber}
      </div>
      <div className="text-[#707579] text-[17px] break-words">{value}</div>
    </div>
  );
};

export default StepComponent;
