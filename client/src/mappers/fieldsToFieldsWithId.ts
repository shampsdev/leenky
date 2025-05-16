import { ExtendedField } from "../pages/create_community/withChat/communityWithChatProfilePage";
import { Field } from "../types/fields/field.interface";
import { v4 as uuidv4 } from "uuid";

export const fieldsToFieldsWithId = (fields: Field[]): ExtendedField[] => {
  return fields.map((field) => ({ ...field, id: uuidv4() }));
};

export const fieldsWithIdToFields = (
  extendedFilds: ExtendedField[]
): Field[] => {
  return extendedFilds.map((efield) => ({
    description: efield.description,
    textarea: efield.textarea,
    textinput: efield.textinput,
    type: efield.type,
    title: efield.title,
  }));
};
