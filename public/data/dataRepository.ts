
// Central data repository that exports all data from various sources
import { temples, Temple } from './templeData';
import { templeStays, nearbyTempleStays, locations, TempleStay } from './templeStayData';
import { 
  scriptures, 
  scriptureCategories, 
  readingSchedule, 
  bookmarks, 
  Scripture, 
  Bookmark, 
  ReadingProgress 
} from './scriptureData';
import { newsData, NewsItem } from './newsRepository';
import { regionSearchRankings, SearchRanking } from './searchRankingRepository';
import { imageRepository } from './imageRepository';
import { nearbyTemples, regionTags } from './templeData';

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
  newsData,
  regionSearchRankings,
  imageRepository
};

// Re-export types
export type { 
  Temple, 
  TempleStay, 
  NewsItem,
  Scripture,
  Bookmark,
  ReadingProgress,
  SearchRanking
};
