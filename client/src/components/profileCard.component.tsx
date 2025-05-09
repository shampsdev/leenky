import { useState } from "react";
import FieldsComponent, { FieldsComponentProps } from "./fields.component";
import ButtonComponent from "./button.component";
import EditCardComponent from "./editCard.component";

const ProfileCardComponent = (props: FieldsComponentProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div className="rounded-lg mt-4 mx-auto w-full">
      <div className="flex flex-row items-center justify-between px-4 text-hint mb-2 mt-4 text-xl">
        {props.community.name}
        <ButtonComponent
          content={isEditing ? "show" : "edit"}
          handleClick={() => setIsEditing(!isEditing)}
          state={"active"}
        />
      </div>
      {!isEditing && <FieldsComponent {...props} />}
      {isEditing && <EditCardComponent communityId={props.community.id} />}
    </div>
  );
};

export default ProfileCardComponent;
