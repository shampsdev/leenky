import { FieldValue } from "../fields/values/fieldValue.interface";

export interface MemberConfig {
  fields: Record<string, FieldValue>;
}
