
// Central data repository that exports all data from various sources
import { temples, nearbyTemples, regionTags } from './templeRepository';
import { templeStays, nearbyTempleStays, locations } from './templeStayRepository';
import { scriptures, scriptureCategories, readingSchedule, bookmarks } from './scriptureRepository';

// All temples data
export const allTemples = [...temples, ...nearbyTemples];

// All temple stays data
export const allTempleStays = [...templeStays, ...nearbyTempleStays];

// Export all data 
export {
  temples,
  nearbyTemples,
  regionTags,
  templeStays,
  nearbyTempleStays,
  locations,
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks
};
