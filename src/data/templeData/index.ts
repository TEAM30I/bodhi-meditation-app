
// This file re-exports everything from the public/data folder
// Import from templeRepository for consistency
import { 
  temples,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  regionTags
} from '../../../public/data/templeData/templeRepository';

// Import nearbyTemples from templeData
import { nearbyTemples } from '../../../public/data/templeData/templeData';

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
export type { Temple } from '../../../public/data/templeData/templeRepository';
