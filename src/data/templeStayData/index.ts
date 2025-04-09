
// This file re-exports everything from the public/data folder
// Import from templeStayRepository for consistency
import { 
  templeStays,
  getTempleStayList,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  locations
} from '../../../public/data/templeStayData/templeStayRepository';

// Export everything from templeStayRepository
export {
  templeStays,
  getTempleStayList,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  locations
};

// Export TempleStay interface
export type { TempleStay } from '../../../public/data/templeStayData/templeStayRepository';
