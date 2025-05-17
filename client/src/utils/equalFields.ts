import { FieldValue } from "../types/fields/fieldValue.interface";

const fieldsAreEqual = (
  a: Record<string, FieldValue>,
  b: Record<string, FieldValue>
): boolean => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!b[key]) return false;
    if (a[key].type !== b[key].type) return false;

    const type = a[key].type;
    if (a[key][type]?.value !== b[key][type]?.value) return false;
  }
  return true;
};
export default fieldsAreEqual;
