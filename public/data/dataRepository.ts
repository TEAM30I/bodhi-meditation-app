
/* ------------------------------------------------------------------
 * 📦 dataRepository.ts
 *  - 각 도메인 모듈의 데이터를 한곳에 모아 재‑export
 *  - 타입도 함께 재‑export
 * ------------------------------------------------------------------*/

/* ────────────────────────────────────────────────────────────
 * 1. 모듈별 데이터 & 타입 임포트
 * ────────────────────────────────────────────────────────────*/
import {
  // Temple‑domain
  temples,
  nearbyTemples,
  regionTags,
  newsData,
  getTempleList,
  searchTemples,
  type Temple,
  type NewsItem,
} from "./templeData/templeRepository";

import {
  // TempleStay‑domain
  templeStays,
  locations,
  getTempleStayList,
  searchTempleStays,
  type TempleStay,
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

import {
  // 검색 순위
  regionSearchRankings,
  templeStaySearchRankings,
  type SearchRanking,
} from "./searchRankingRepository";

import { imageRepository } from "./image/imageRepository";

/* ────────────────────────────────────────────────────────────
 * 2. 도메인 통합 컬렉션
 * ────────────────────────────────────────────────────────────*/
/** 사찰 전체 목록(Temple) */
export const allTemples = getTempleList();

/** 템플스테이 전체 목록(TempleStay) */
export const allTempleStays = getTempleStayList();

/* ────────────────────────────────────────────────────────────
 * 3. 하위 모듈 재‑export
 * ────────────────────────────────────────────────────────────*/
export {
  // Temple‑domain
  temples,
  nearbyTemples,
  regionTags,
  newsData,
  getTempleList,
  searchTemples,

  // TempleStay‑domain
  templeStays,
  locations,
  getTempleStayList,
  searchTempleStays,

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
  regionSearchRankings,
  templeStaySearchRankings,
  imageRepository,
};

/* ────────────────────────────────────────────────────────────
 * 4. 타입 재‑export
 * ────────────────────────────────────────────────────────────*/
export type {
  Temple,
  TempleStay,
  NewsItem,
  Scripture,
  Bookmark,
  ReadingProgress,
  SearchRanking,
  ScriptureColorScheme,
};
