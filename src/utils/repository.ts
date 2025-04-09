
// Central repository import file for consistent imports across the app
import { lazy } from 'react';

// Repository exports with consistent static imports
export { 
  imageRepository
} from '/public/data/image/imageRepository';

// Import helper functions from the correct location
export { 
  getProfileImage, 
  getScriptureImage, 
  getTempleImage, 
  getBackgroundImage, 
  getIconImage 
} from '/public/data/image/imageRepository';

export { 
  regionSearchRankings, 
  templeStaySearchRankings 
} from '/public/data/searchRankingRepository';

export {
  temples,
  newsData,
  nearbyTemples,
  regionTags,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  type Temple,
  type NewsItem
} from '/public/data/templeData/templeRepository';

export {
  templeStays,
  locations,
  getTempleStayList,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  type TempleStay
} from '/public/data/templeStayData/templeStayRepository';

export {
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  calendarData,
  getScriptureById,
  updateReadingProgress,
  addBookmark,
  type Scripture,
  type ScriptureChapter,
  type Bookmark,
  type ReadingProgress,
  type ReadingScheduleItem,
  type ScriptureColorScheme
} from '/public/data/scriptureData/scriptureRepository';

// Lazy loaded components for dynamic imports
export const LazyScriptureReader = lazy(() => import('@/pages/scripture/ScriptureReader'));
