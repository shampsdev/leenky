import { useNavigate } from "react-router-dom";
import EBBComponent from "../../../components/enableBackButtonComponent";
import FixedBottomButtonComponent from "../../../components/fixedBottomButton.component";
import Plus from "../../../assets/plus.svg";
import { useState } from "react";
import { Field } from "../../../types/fields/field.interface";
import CommunityProfileField from "../../../components/communityProfileField";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

export type FieldWithId = Field & { id: string };

const CommunityWithChatProfilePage = () => {
  const navigate = useNavigate();
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<FieldWithId[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(fields, oldIndex, newIndex);
        setFields(newFields);
      }
    }
  };

  const addNewField = () => {
    setFields([
      ...fields,
      {
        id: uuidv4(),
        description: "",
        title: "",
        type: "textinput",
      },
    ]);
  };

  return (
    <EBBComponent>
      <div className="mb-[32px] mt-[28px] px-[12px]">
        <p className="font-semibold text-[20px]">Основная информация</p>
        <span className="text-[17px] text-[#707579]">
          Создайте поля для заполнения информации о приглашённых участниках и
          задайте их размер
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-row justify-between border-[#F5F5F5] border-[2px] text-[#A2ACB0] px-[16px] py-[12px] rounded-[14px]">
              <p>Имя, фамилия</p>
            </div>
            {fields.map((field, index) => (
              <CommunityProfileField
                key={field.id}
                id={field.id}
                index={index}
                isOpen={openedIndex === index}
                onOpen={() => setOpenedIndex(index)}
                onClose={() => setOpenedIndex(null)}
                handleDelete={() => {
                  const updated = fields.filter((_, i) => i !== index);
                  setFields(updated);
                  if (openedIndex === index) setOpenedIndex(null);
                }}
              />
            ))}
            <div
              className="flex justify-center bg-[#F5F5F5] py-[20px] rounded-[14px]"
              onClick={addNewField}
            >
              <img className="" src={Plus} alt="Добавить поле" />
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <FixedBottomButtonComponent
        content="Продолжить"
        state={true ? "active" : "disabled"}
        handleClick={() => navigate("/community/create/with_chat/connect_chat")}
      />
      <div className="pb-[200px]"></div>
    </EBBComponent>
  );
};

export default CommunityWithChatProfilePage;
