import { useForm, Controller } from "react-hook-form";
import { Field } from "../types/fields/field.interface";
import { FieldValue } from "../types/fields/fieldValue.interface";
import ButtonComponent from "../components/button.component";
import EBBComponent from "../components/enableBackButtonComponent";
import InputFieldComponent from "../components/inputField.component";
import TextareaFieldComponent from "../components/textareaField.component";
import { MemberConfig } from "../types/member/memberConfig.interface";

type FormData = Record<string, string>;

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: MemberConfig) => Promise<void>;
  avatar?: string;
}

const DynamicForm = ({ fields, onSubmit }: DynamicFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.title]:
          field.type === "textarea"
            ? field.textarea?.default || ""
            : field.textinput?.default || "",
      }),
      {} as FormData
    ),
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      const submitData: MemberConfig = {
        fields: fields.reduce<Record<string, FieldValue>>((acc, field) => {
          acc[field.title] = {
            type: field.type,
            [field.type]: {
              value: data[field.title],
            },
          };
          return acc;
        }, {}),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <EBBComponent>
      <div className="w-[95%] mx-auto py-4 px-4">
        <form
          className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {fields.map((field) => (
            <Controller
              key={field.title}
              name={field.title}
              control={control}
              rules={{
                required: `${field.title} is required`,
                maxLength: {
                  value: field.type === "textarea" ? 230 : 40,
                  message: `Maximum length is ${
                    field.type === "textarea" ? 230 : 40
                  } characters`,
                },
              }}
              render={({ field: formField }) =>
                field.type === "textarea" ? (
                  <TextareaFieldComponent
                    title={field.title}
                    onChangeFunction={formField.onChange}
                    value={formField.value}
                    maxLength={230}
                  />
                ) : (
                  <InputFieldComponent
                    title={field.title}
                    onChangeFunction={formField.onChange}
                    value={formField.value}
                    maxLength={40}
                  />
                )
              }
            />
          ))}

          <div className="flex w-full justify-center pt-[20px]">
            <ButtonComponent
              content="Готово"
              state={isValid ? "active" : "disabled"}
              handleClick={() => {}}
            />
          </div>
        </form>
      </div>
    </EBBComponent>
  );
};

export default DynamicForm;
