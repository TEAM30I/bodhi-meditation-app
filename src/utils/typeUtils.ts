
/**
 * Helper utility to safely cast data to a specific type
 * This doesn't perform any runtime type checking, it's just a TypeScript helper
 */
export function typedData<T>(data: unknown): T {
  return data as T;
}
