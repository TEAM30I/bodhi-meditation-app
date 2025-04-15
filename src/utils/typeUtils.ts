
/**
 * A utility function that returns the input with a specific type.
 * This helps TypeScript understand the type of our data at runtime.
 */
export function typedData<T>(data: unknown): T {
  return data as T;
}
