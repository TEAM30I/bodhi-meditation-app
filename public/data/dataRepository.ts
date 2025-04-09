
// Central data repository that exports all data from various sources
import { temples, Temple } from './templeRepository';
import { templeStays, nearbyTempleStays, locations, TempleStay } from './templeStayRepository';
import { scriptures, scriptureCategories, readingSchedule, bookmarks } from '/src/data/scriptureRepository';
import { nearbyTemples, regionTags } from '/src/data/templeData';
import { newsData, NewsItem } from './newsRepository';

// All temples data - combine all temple data from different sources
export const allTemples = [...temples, ...nearbyTemples];

// All temple stays data - combine all temple stay data from different sources
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
  bookmarks,
  newsData
};

// Re-export types
export type { Temple, TempleStay, NewsItem };
