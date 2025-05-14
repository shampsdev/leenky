import { Field } from "../types/fields/field.interface";

const fieldsAreEqual = (a: Field[], b: Field[]) => {
  return a.every((field, index) => {
    if (field.type === "textinput") {
      return field.textinput?.default === b[index].textinput?.default;
    }
    if (field.type === "textarea") {
      return field.textarea?.default === b[index].textarea?.default;
    }
    return true;
  });
};
export default fieldsAreEqual;
