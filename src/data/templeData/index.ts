
// This file re-exports everything from the public/data folder
// Import from templeRepository for consistency
import { 
  temples,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  regionTags
} from '@/data/templeData/repository';

// Import nearbyTemples from templeData
import { nearbyTemples } from '@/data/templeData/templeData';

// Export everything from templeRepository
export {
  temples,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  regionTags,
  nearbyTemples
};

// Export Temple interface
export type { Temple } from '@/data/templeData/repository';

// Additional utility function - get temple by ID
export const getTempleById = (id: string) => {
  return temples[id];
};
