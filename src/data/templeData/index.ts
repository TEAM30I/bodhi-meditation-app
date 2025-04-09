
import { 
  temples,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  regionTags 
} from './repository';

// Export everything from templeRepository
export {
  temples,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  regionTags
};

// Export Temple interface
export type { Temple } from './repository';

// Additional utility function - get temple by ID
export const getTempleById = (id: string) => {
  return temples[id];
};
