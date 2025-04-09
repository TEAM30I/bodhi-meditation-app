
import { templeStays, TempleStay } from './templeStayData/templeStayRepository';

// Function to get temple stay by ID
export const getTempleStayById = (id: string): TempleStay | undefined => {
  return templeStays[id];
};

// Re-export from templeStayRepository
export { 
  templeStays,
  getTempleStayList,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  locations
} from './templeStayData/templeStayRepository';

// Export TempleStay interface
export type { TempleStay } from './templeStayData/templeStayRepository';
