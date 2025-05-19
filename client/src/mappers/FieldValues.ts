import { Field } from "../types/fields/field.interface";
import { FieldValue } from "../types/fields/fieldValue.interface";

export const fieldsToFieldValues = (
  fields: Field[]
): Record<string, FieldValue> => {
  const fieldValues: Record<string, FieldValue> = {};

  fields.forEach((field) => {
    switch (field.type) {
      case "textarea": {
        fieldValues[field.title] = {
          type: field.type,
          textarea: {
            value: field.textarea?.default || "",
          },
        };
        break;
      }
      case "textinput": {
        fieldValues[field.title] = {
          type: field.type,
          textinput: {
            value: field.textinput?.default || "",
          },
        };
        break;
      }
    }
  });

  return fieldValues;
};

export const fieldValuesToFields = (
  fieldValues: Record<string, FieldValue>
): Field[] => {
  const fields: Field[] = [];

  for (const fieldTitle in fieldValues) {
    const fieldValue = fieldValues[fieldTitle];
    const field: Field = {
      description: "",
      title: fieldTitle,
      type: fieldValue.type,
      [fieldValue.type]: {
        default: fieldValue[fieldValue.type]?.value || "",
      },
    };
    fields.push(field);
  }

  return fields;
};
