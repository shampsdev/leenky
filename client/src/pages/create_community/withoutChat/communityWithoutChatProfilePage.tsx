import { useNavigate } from "react-router-dom";
import EBBComponent from "../../../components/enableBackButtonComponent";
import Plus from "../../../assets/plus.svg";
import { useState } from "react";
import { Field } from "../../../types/fields/field.interface";
import CommunityProfileField from "../../../components/communityProfileField";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import FixedBottomButtonComponent from "../../../components/fixedBottomButton.component";
import { SortableItem } from "../../../components/sortableItem";
import { fieldsToFieldsWithId } from "../../../mappers/fieldsToFieldsWithId";
import { FieldType } from "../../../types/fields/field.type";
import useCommunityWithoutChatInfoStore from "../../../stores/create_community/communityWithoutChatInfo.store";
import useCreateCommunity from "../../../hooks/communities/mutations/useCreateCommunity";
import useSetCommunityAvatar from "../../../hooks/communities/mutations/usePostAvatarCommunity";

export interface ExtendedField extends Field {
  id: string;
}
const CommunityWithoutChatProfilePage = () => {
  const {
    fields: storeFields,
    description,
    avatar,
    name,
  } = useCommunityWithoutChatInfoStore();
  const navigate = useNavigate();
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<ExtendedField[]>(
    fieldsToFieldsWithId(storeFields)
  );
  const createCommunityMutation = useCreateCommunity();
  const setCommunityAvatarMutation = useSetCommunityAvatar();
  const handleContinue = async () => {
    try {
      const community = await createCommunityMutation.mutateAsync({
        communityData: {
          avatar: "",
          config: {
            fields: fields.filter((field) => field.title.length > 0),
          },
          description: description,
          name: name,
        },
      });

      if (community) {
        if (avatar) {
          await setCommunityAvatarMutation.mutateAsync({
            communityId: community.id,
            avatar,
          });
        }

        navigate(`/communities`, { replace: true });
        navigate(`/profile/current/${community.id}`);
        navigate(`/profile/current/${community.id}/edit`);
        navigate(`/community/${community.id}/links`);

        // navigate("/community/create/with_chat/connect_chat");
      }
    } catch (error) {
      alert("Произошла ошибка при создании сообщества или загрузке аватара");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      if (openedIndex !== null) {
        setOpenedIndex(null);
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

  const handleDelete = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
    if (openedIndex === index) setOpenedIndex(null);
  };

  return (
    <EBBComponent>
      <div className="mb-[32px] mt-[28px] px-[12px]">
        <p className="font-semibold text-[20px]">Профиль участника</p>
        <span className="text-[17px] text-[#707579]">
          Создайте поля для заполнения информации о приглашённых участниках и
          задайте их размер
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
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
              <SortableItem key={field.id} id={field.id}>
                <CommunityProfileField
                  value={field.title}
                  onChange={(newValue) => {
                    const updated = [...fields];
                    updated[index] = { ...updated[index], title: newValue };
                    setFields(updated);
                  }}
                  type={field.type}
                  isOpen={openedIndex === index}
                  onOpen={() => setOpenedIndex(index)}
                  onClose={() => setOpenedIndex(null)}
                  handleDelete={() => handleDelete(index)}
                  onTypeChange={(type: FieldType) => {
                    const updated = [...fields];
                    updated[index] = { ...updated[index], type: type };
                    setFields(updated);
                  }}
                />
              </SortableItem>
            ))}

            <div
              className="flex justify-center bg-[#F5F5F5] py-[20px] rounded-[14px]"
              onClick={addNewField}
            >
              <img className="" src={Plus} />
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <FixedBottomButtonComponent
        content="Продолжить"
        state={true ? "active" : "disabled"}
        handleClick={() => handleContinue()}
      />
      <div className="pb-[200px]"></div>
    </EBBComponent>
  );
};

export default CommunityWithoutChatProfilePage;
