
/**
 * A type utility function that preserves the type of repository data
 * while making TypeScript happy
 */
export function typedData<T>(data: any): T {
  return data as T;
}
