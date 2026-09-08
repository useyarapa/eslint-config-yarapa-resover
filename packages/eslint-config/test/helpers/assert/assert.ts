/**
 * Return a required value or throw an error with the given label.
 * @param value Value to assert.
 * @param label Name used in the error message.
 * @returns Non-null and non-undefined value.
 */
export function required<T>(value: null | T | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing required value: ${label}`);
  }

  return value;
}
