import { useState } from "react";
import { Field } from "../types/fields/field.interface";
import { MemberConfig } from "../types/member/memberConfig.interface";
import ButtonComponent from "./button.component";
import EBBComponent from "./enableBackButtonComponent";
import InputFieldComponent from "./form/inputField.component";
import TextareaFieldComponent from "./form/textareaField.component";
import fieldsAreEqual from "../utils/equalFields";
import { fieldsToFieldValues } from "../mappers/FieldValues";

interface FormProps {
  fields: Field[];
}

const EditProfileForm = ({ fields }: FormProps) => {
  const [formChanged, setFormChanged] = useState<boolean>(false);
  // const patchMemberMutation = usePatchMember();
  // const navigate = useNavigate();
  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...stateFields];
    if (
      updatedFields[index].type === "textinput" &&
      updatedFields[index].textinput
    ) {
      updatedFields[index].textinput.default = value;
    } else if (
      updatedFields[index].type === "textarea" &&
      updatedFields[index].textarea
    ) {
      updatedFields[index].textarea.default = value;
    }
    setStateFields(updatedFields);
    setFormChanged(!fieldsAreEqual(updatedFields, fields));
  };

  const handleFormSubmit = async () => {
    try {
      const submitData: MemberConfig = {
        fields: fieldsToFieldValues(fields),
      };
      console.log(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const [stateFields, setStateFields] = useState<Field[]>(fields);
  return (
    <EBBComponent>
      <div className="w-[95%] mx-auto py-4 px-4">
        <form
          className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {stateFields.map((field, index) => {
            if (field.type === "textarea")
              return (
                <TextareaFieldComponent
                  key={index}
                  title={field.title}
                  value={field.textarea?.default || ""}
                  maxLength={230}
                  onChangeFunction={(val: string) =>
                    handleFieldChange(index, val)
                  }
                />
              );
            else if (field.type === "textinput")
              return (
                <InputFieldComponent
                  key={index}
                  title={field.title}
                  value={field.textinput?.default || ""}
                  maxLength={40}
                  onChangeFunction={(val: string) =>
                    handleFieldChange(index, val)
                  }
                />
              );
          })}

          <div className="flex w-full justify-center pt-[20px]">
            <ButtonComponent
              content="Готово"
              state={formChanged ? "active" : "disabled"}
              handleClick={() => handleFormSubmit()}
            />
          </div>
        </form>
      </div>
    </EBBComponent>
  );
};
export default EditProfileForm;
