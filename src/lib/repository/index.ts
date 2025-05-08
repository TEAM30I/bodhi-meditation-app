// src/lib/repository/index.ts
// 사찰 관련 함수
export {
    getTempleList,
    getTempleDetail,
    searchTemples,
    filterTemplesByTag,
    followTemple,
    unfollowTemple,
    getTopLikedTemples,
    getNearbyTemples,
    getUserFollowedTemples,
    getTopRegions,
    getTempleRegions,
    getRegionTags,
    isTempleFollowed,
    toggleTempleFollow
  } from './templeRepository';
  
  // 템플스테이 관련 함수
  export {
    getTempleStayList,
    getTempleStayDetail,
    searchTempleStays,
    filterTempleStaysByTag,
    followTempleStay,
    unfollowTempleStay,
    getUserFollowedTempleStays,
    getTempleStaysByRegion,
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