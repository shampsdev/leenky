import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface SortableFieldWrapperProps {
  id: string;
  children: React.ReactNode;
  dragHandle?: (attributes: any, listeners: any) => React.ReactNode;
}

const SortableFieldWrapper = ({
  id,
  children,
  dragHandle,
}: SortableFieldWrapperProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2">
        {dragHandle?.(attributes, listeners)}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
export default SortableFieldWrapper;
