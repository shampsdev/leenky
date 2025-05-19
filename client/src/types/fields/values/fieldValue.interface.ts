import { FieldType } from "../field.type";
import { FieldValueTextArea } from "./fieldValueTextArea.interface";
import { FieldValueTextInput } from "./fieldValutTextInput.interface";

export interface FieldValue {
  textarea?: FieldValueTextArea;
  textinput?: FieldValueTextInput;
  type: FieldType;
}
