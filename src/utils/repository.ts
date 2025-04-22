// Repository exports with consistent static imports
export { 
  getRegionSearchRankings, 
  getTempleStaySearchRankings,
  addSearchTerm,
  updateSearchTrends,
  getSearchTrendAnalytics,
  type SearchRanking
} from '/public/data/searchRankingRepository';

export {
  regionTags,
  getTempleList,
  getTopLikedTemples,
  filterTemplesByTag,
  searchTemples,
  getTempleDetail,
  getNearbyTemples,
  followTemple,
  unfollowTemple,
  getUserFollowedTemples,
  type Temple,
  type NewsItem
} from '/public/data/templeData/templeRepository';

export {
  getLocations,
  getTempleStayList,
  getTempleStayDetail,
  getTopLikedTempleStays,
  searchTempleStays,
  filterTempleStaysByTag,
  getNearbyTempleStays,
  followTempleStay,
  unfollowTempleStay,
  getUserFollowedTempleStays,
  getTempleStaysByRegion,
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

// Components for lazy loading
import ScriptureReader from '@/pages/scripture/ScriptureReader';
export const LazyScriptureReader = ScriptureReader;
