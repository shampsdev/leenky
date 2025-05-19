import { useState, useEffect } from "react";
import { FieldValue } from "../../types/fields/fieldValue.interface";

export interface ExtractedField {
  name: string;
  value: string;
}

export const useExtractFields = (fields?: Record<string, FieldValue>) => {
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [textInputs, setInputFields] = useState<ExtractedField[]>([]);
  const [textAreas, setTextareaFields] = useState<ExtractedField[]>([]);
  useEffect(() => {
    if (!fields) {
      setExtractedFields([]);
      setInputFields([]);
      setTextareaFields([]);
      return;
    }

    const extractFields: ExtractedField[] = [];
    const inputs: ExtractedField[] = [];
    const textareas: ExtractedField[] = [];
    for (const [name, field] of Object.entries(fields)) {
      if (field.type === "textinput" && field.textinput) {
        inputs.push({ name, value: field.textinput.value });
        extractFields.push({ name, value: field.textinput.value });
      } else if (field.type === "textarea" && field.textarea) {
        textareas.push({ name, value: field.textarea.value });
        extractFields.push({ name, value: field.textarea.value });
      }
    }

    setInputFields(inputs);
    setTextareaFields(textareas);
    setExtractedFields(extractFields);
  }, [fields]);

  return { textAreas, textInputs, extractedFields };
};
