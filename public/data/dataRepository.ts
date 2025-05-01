
/* ------------------------------------------------------------------
 * 📦 repository.ts
 *  - 각 도메인 모듈의 데이터를 한곳에 모아 재‑export
 *  - 타입도 함께 재‑export
 * ------------------------------------------------------------------*/

/* ────────────────────────────────────────────────────────────
 * 1. 모듈별 데이터 & 타입 임포트
 * ────────────────────────────────────────────────────────────*/
// 모든 import를 상대 경로로 변경하여 빌드 에러 해결
import {
  // Temple‑domain
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
  type Temple,
  type TempleSort,
  type RegionTag
} from "./templeData/templeRepository";

import {
  // TempleStay‑domain
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
  getTempleStayLocations,
  type TempleStay,
  type TempleStaySort
} from "./templeStayData/templeStayRepository";

import {
  // Scripture‑domain
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  calendarData,
  getScriptureById,
  updateReadingProgress,
  addBookmark,
  type Scripture,
  type Bookmark,
  type ReadingProgress,
  type ScriptureColorScheme,
} from "./scriptureData/scriptureRepository";

// 이미지 Repository는 경로 수정 필요
import { imageRepository } from "./image/imageRepository";

/* ────────────────────────────────────────────────────────────
 * 2. 도메인 통합 컬렉션 (비동기 함수로 수정)
 * ────────────────────────────────────────────────────────────*/
/** 
 * 사찰 전체 목록(Temple)을 가져오는 함수 
 */
export async function getAllTemples(): Promise<Temple[]> {
  return await getTempleList();
}

/** 
 * 템플스테이 전체 목록(TempleStay)을 가져오는 함수 
 */
export async function getAllTempleStays(): Promise<TempleStay[]> {
  return await getTempleStayList();
}

/* ────────────────────────────────────────────────────────────
 * 3. 하위 모듈 재‑export
 * ────────────────────────────────────────────────────────────*/
export {
  // Temple‑domain
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

  // TempleStay‑domain
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
  getTempleStayLocations,

  // Scripture‑domain
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  calendarData,
  getScriptureById,
  updateReadingProgress,
  addBookmark,

  // 기타 공용
  imageRepository,
};

/* ────────────────────────────────────────────────────────────
 * 4. 타입 재‑export
 * ────────────────────────────────────────────────────────────*/
export type {
  Temple,
  TempleStay,
  Scripture,
  Bookmark,
  ReadingProgress,
  ScriptureColorScheme,
  TempleSort,
  TempleStaySort,
  RegionTag
};
