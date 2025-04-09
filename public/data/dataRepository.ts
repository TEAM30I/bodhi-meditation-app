
// Central data repository that exports all data from various sources
import { temples, Temple } from './templeData/templeRepository';
import { templeStays, locations, TempleStay } from './templeStayData/templeStayRepository';
import { 
  scriptures, 
  scriptureCategories, 
  readingSchedule, 
  bookmarks, 
  Scripture, 
  Bookmark,
  scriptureColorSchemes,
  ScriptureChapter
} from './scriptureData/scriptureRepository';
import { scriptureTexts } from './scriptureData';
import { newsData, NewsItem } from './newsRepository';
import { regionSearchRankings, SearchRanking } from './searchRankingRepository';
import { imageRepository } from './imageRepository';
import { regionTags } from './templeData/templeData';

// All temples data - combine temple data from different sources
// We no longer use nearbyTemples as they are already included in temples
export const allTemples = Object.values(temples);

// All temple stays data
export const allTempleStays = Object.values(templeStays);

// Export all data 
export {
  temples,
  regionTags,
  templeStays,
  locations,
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  newsData,
  regionSearchRankings,
  imageRepository,
  scriptureColorSchemes,
  scriptureTexts
};

// Re-export types
export type { 
  Temple, 
  TempleStay, 
  NewsItem,
  Scripture,
  Bookmark,
  ScriptureChapter,
  SearchRanking
};
