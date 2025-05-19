import { FieldType } from "./field.type";
import { FieldValueTextArea } from "./values/fieldValueTextArea.interface";
import { FieldValueTextInput } from "./values/fieldValutTextInput.interface";

export interface FieldValue {
  textarea?: FieldValueTextArea;
  textinput?: FieldValueTextInput;
  type: FieldType;
}
