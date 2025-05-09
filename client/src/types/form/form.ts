import { FieldType } from "../fields/field.type";

export type FieldSchema = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxLength?: number;
  componentProps?: Record<string, any>;
};
