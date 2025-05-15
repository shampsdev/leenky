import { Field } from "../types/fields/field.interface";

const fieldsNotEmpty = (a: Field[]) => {
  return a.every((field, index) => {
    if (field.type === "textinput") {
      return field.textinput?.default.trim().length! > 0;
    }
    if (field.type === "textarea") {
      return field.textarea?.default.trim().length! > 0;
    }
    return true;
  });
};
export default fieldsNotEmpty;
