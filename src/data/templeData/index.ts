
// This file re-exports everything from the public/data folder to maintain backwards compatibility
// Export specifically from templeRepository to avoid ambiguity
export { temples } from '../../../public/data/templeData/templeRepository';
// Export specifically from templeData to avoid conflicts with templeRepository
export { popularTemples } from '../../../public/data/templeData/templeData';
// Explicitly re-export nearbyTemples and regionTags from templeRepository to resolve ambiguity
export { nearbyTemples, regionTags } from '../../../public/data/templeData/templeRepository';
// Export Temple interface from templeRepository to avoid conflict
export type { Temple } from '../../../public/data/templeData/templeRepository';
