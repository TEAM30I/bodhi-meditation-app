
/**
 * Utility functions to safely handle type assertions
 */

/**
 * Cast a value to the specified type
 * Use this when you're confident the value is of the specified type
 * but TypeScript can't infer it correctly
 */
export function cast<T>(value: unknown): T {
  return value as T;
}

/**
 * Type guard to check if a value has a property
 */
export function hasProperty<K extends string>(obj: unknown, prop: K): obj is { [key in K]: unknown } {
  return obj !== null && typeof obj === 'object' && prop in obj;
}

/**
 * Extract typed data from repository objects safely
 * Useful for handling repository data that might be typed as 'unknown'
 */
export function typedData<T>(data: unknown): T {
  return data as T;
}

// Mock the imageRepository for local development and type checking
// This will be replaced by the actual imported data at runtime
export const mockImageRepository = {
  templeBanner: {
    default: '/placeholder-image.jpg'
  },
  logo: {
    default: '/placeholder-logo.jpg'
  }
};
