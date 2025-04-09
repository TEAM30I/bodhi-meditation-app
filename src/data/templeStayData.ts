
import { templeStays, TempleStay } from '../../../public/data/templeStayData/templeStayRepository';

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
} from '@/data/templeStayData/index';

// Export TempleStay interface
export type { TempleStay } from '@/data/templeStayData/index';
