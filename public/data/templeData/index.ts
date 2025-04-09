
// Re-export everything from templeRepository except Temple
export { temples } from './templeRepository';
// Re-export everything from templeData
export * from './templeData';
// Export Temple interface from templeRepository to avoid conflict
export type { Temple } from './templeRepository';

