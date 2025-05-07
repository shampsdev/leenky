// hooks/useExtractFields.js
import { useState, useEffect } from "react";
import { FieldValue } from "../../types/fields/fieldValue.interface";

export const useExtractFields = (fields: Record<string, FieldValue>) => {
  const [textInputs, setTextInputs] = useState<string[]>([]);
  const [textAreas, setTextAreas] = useState<string[]>([]);

  useEffect(() => {
    const extractedTextInputs = Object.entries(fields)
      .filter(([_, field]) => field.type === "textinput")
      .map(([key, field]) => ({ key, ...field }));

    const extractedTextAreas = Object.entries(fields)
      .filter(([_, field]) => field.type === "textarea")
      .map(([key, field]) => ({ key, ...field }));

    setTextInputs(extractedTextInputs.map((field) => field.textinput!.value));
    setTextAreas(extractedTextAreas.map((field) => field.textarea!.value));
  }, [fields]);

  return { textInputs, textAreas };
};
