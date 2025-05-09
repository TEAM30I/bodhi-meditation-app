// src/lib/repository/index.ts
// 사찰 관련 함수
export {
    getTempleDetail,
    searchTemples,
    followTemple,
    unfollowTemple,
    getTopLikedTemples,
    getUserFollowedTemples,
    getTempleRegions,
    getRegionTags,
    isTempleFollowed,
    toggleTempleFollow
  } from './templeRepository';
  
  // 템플스테이 관련 함수
  export {
    getTempleStayDetail,
    searchTempleStays,
    followTempleStay,
    unfollowTempleStay,
    getUserFollowedTempleStays,
    getTopLikedTempleStays,
    getTempleStayRegions,
    getTempleStayLocations
  } from './templeStayRepository';
  
  // 경전 관련 함수
  export {
    fetchScripture,
    updateReadingProgress,
    addBookmark,
    getBookmarks,
    getScriptureList,
    getCalendarData,
    getReadingSchedule
  } from './scriptureRepository';