
/**
 * Utility for safely asserting types in our application.
 * Use this when TypeScript has trouble inferring types from our data repositories.
 */

/**
 * Assert that a value is of type T
 * This function helps TypeScript understand that we've checked the type
 */
export function assertType<T>(value: unknown): asserts value is T {
  // This is a type assertion function that does nothing at runtime
  // It just helps TypeScript understand the type
}

/**
 * Safely cast an unknown value to type T
 * Use when you're confident the value is of type T but TypeScript can't infer it
 */
export function castToType<T>(value: unknown): T {
  return value as T;
}
