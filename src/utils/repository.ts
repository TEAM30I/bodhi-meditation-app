
import ScriptureReader from '@/pages/scripture/ScriptureReader';
// Repository exports with consistent static imports
export { 
  regionSearchRankings, 
  templeStaySearchRankings 
} from '/public/data/searchRankingRepository';

export {
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
export const LazyScriptureReader = ScriptureReader;
