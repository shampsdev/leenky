import { useState, useEffect } from "react";
import { FieldValue } from "../../types/fields/fieldValue.interface";

export interface ExtractedField {
  name: string;
  value: string;
}

export const useExtractFields = (fields?: Record<string, FieldValue>) => {
  const [textInputs, setTextInputs] = useState<ExtractedField[]>([]);
  const [textAreas, setTextAreas] = useState<ExtractedField[]>([]);

  useEffect(() => {
    if (!fields) {
      setTextInputs([]);
      setTextAreas([]);
      return;
    }

    const inputs: ExtractedField[] = [];
    const areas: ExtractedField[] = [];

    for (const [name, field] of Object.entries(fields)) {
      if (field.type === "textinput" && field.textinput) {
        inputs.push({ name, value: field.textinput.value });
      } else if (field.type === "textarea" && field.textarea) {
        areas.push({ name, value: field.textarea.value });
      }
    }

    setTextInputs(inputs);
    setTextAreas(areas);
  }, [fields]);

  return { textInputs, textAreas };
};
