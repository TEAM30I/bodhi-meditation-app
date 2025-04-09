
import { 
  temples,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  regionTags 
} from '../../public/data/templeData/templeRepository';

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
export type { Temple } from '../../public/data/templeData/templeRepository';

// Additional utility function - get temple by ID
export const getTempleById = (id: string) => {
  return temples[id];
};
