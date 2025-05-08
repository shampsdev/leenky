import { FieldType } from "./field.type";
import { FieldTextArea } from "./fieldTextArea.interface";
import { FieldTextInput } from "./fieldTextInput.interface";

export interface Field {
  description: string;
  textarea?: FieldTextArea;
  textinput?: FieldTextInput;
  title: string;
  type: FieldType;
}
