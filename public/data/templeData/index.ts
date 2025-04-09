
// Re-export everything from templeRepository except Temple
export { temples, nearbyTemples } from './templeRepository';
// Re-export everything from templeData
export * from './templeData';
// Export Temple interface from templeData to avoid conflict
export type { Temple } from './templeRepository';
