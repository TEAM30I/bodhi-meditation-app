
// Import all repository functions and types from public/data
import {
  // Temple-domain
  regionTags,
  getTempleList,
  getTempleDetail,
  searchTemples,
  filterTemplesByTag,
  followTemple,
  unfollowTemple,
  getNearbyTemples,
  getTopLikedTemples,
  // TempleStay-domain
  getTempleStayList,
  getTempleStayDetail,
  searchTempleStays,
  filterTempleStaysByTag,
  followTempleStay,
  unfollowTempleStay,
  getNearbyTempleStays,
  getTempleStaysByRegion,
  // Scripture-domain
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  calendarData,
  getScriptureById,
  updateReadingProgress,
  addBookmark,
  // Types
  type Temple,
  type TempleStay,
  type Scripture,
  type Bookmark,
  type ReadingProgress,
  type ScriptureColorScheme,
} from '/public/data/dataRepository';

// Re-export everything
export {
  // Temple-domain
  regionTags,
  getTempleList,
  getTempleDetail,
  searchTemples,
  filterTemplesByTag,
  followTemple,
  unfollowTemple,
  getNearbyTemples,
  getTopLikedTemples,
  // TempleStay-domain
  getTempleStayList,
  getTempleStayDetail,
  searchTempleStays,
  filterTempleStaysByTag,
  followTempleStay,
  unfollowTempleStay,
  getNearbyTempleStays,
  getTempleStaysByRegion,
  // Scripture-domain
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  calendarData,
  getScriptureById,
  updateReadingProgress,
  addBookmark,
};

// Re-export types
export type {
  Temple,
  TempleStay,
  Scripture,
  Bookmark,
  ReadingProgress,
  ScriptureColorScheme,
};
