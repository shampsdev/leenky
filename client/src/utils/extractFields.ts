import { Field } from "../types/fields/field.interface";
import { FieldValue } from "../types/fields/fieldValue.interface";

function extractFields(
  fields: Record<string, FieldValue>,
  fieldsOrder: Field[]
) {
  let textArea = null;
  let firstTextInput = null;
  let secondTextInput = null;

  for (const field of fieldsOrder) {
    const fieldData = fields[field.title];

    if (field.type === "textinput") {
      if (!firstTextInput) {
        firstTextInput = fieldData?.textinput?.value ?? null;
      } else if (!secondTextInput) {
        secondTextInput = fieldData?.textinput?.value ?? null;
      }
    } else if (field.type === "textarea" && !textArea) {
      textArea = fieldData?.textarea?.value ?? null;
    }

    if (textArea && firstTextInput && secondTextInput) break;
  }

  return { textArea, firstTextInput, secondTextInput };
}

export default extractFields;
