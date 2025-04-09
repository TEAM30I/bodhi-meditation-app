
// This file re-exports everything from the public data repository

// Import from templeStayRepository
import { 
  templeStays,
  getTempleStayList,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  locations
} from '../../../public/data/templeStayData/templeStayRepository';

// Export all the functions and data
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

// Function to get temple stay by ID
export const getTempleStayById = (id: string) => {
  return templeStays[id];
};
