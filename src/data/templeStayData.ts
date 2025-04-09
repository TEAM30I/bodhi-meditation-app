
// Import from the index.ts file
import { templeStays, TempleStay } from './templeStayData/index';

// Function to get temple stay by ID
export const getTempleStayById = (id: string): TempleStay | undefined => {
  return templeStays[id];
};

// Re-export from templeStayData/index.ts
export { 
  templeStays,
  getTempleStayList,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  locations
} from './templeStayData/index';

// Export TempleStay interface
export type { TempleStay } from './templeStayData/types';
