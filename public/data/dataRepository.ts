/* ------------------------------------------------------------------
 * 📦 centralRepository.ts
 *  - 각 도메인 모듈의 데이터를 한곳에 모아 재‑export
 *  - 타입도 함께 재‑export
 * ------------------------------------------------------------------*/

/* ────────────────────────────────────────────────────────────
 * 1. 모듈별 데이터 & 타입 임포트
 * ────────────────────────────────────────────────────────────*/
import {
  // Temple‑domain
  templeData as temples,   // 병합·중복 제거가 끝난 최종 배열
  nearbyTemples,
  regionTags,
  newsData,
  type Temple,
  type NewsItem,
} from "./templeData/templeRepository";

import {
  // TempleStay‑domain
  templeStays as templeStaysRecord, // Record<string, TempleStay>
  locations,
  type TempleStay,
} from "./templeStayData/templeStayRepository";

import {
  // Scripture‑domain
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  type Scripture,
  type Bookmark,
  type ReadingProgress,
} from "./scriptureData/scriptureRepository";

import {
  // 검색 순위 & 이미지 레포
  regionSearchRankings,
  type SearchRanking,
} from "./searchRankingRepository";

import { imageRepository } from "./imageRepository";

/* ────────────────────────────────────────────────────────────
 * 2. 도메인 통합 컬렉션
 * ────────────────────────────────────────────────────────────*/
/** 사찰 전체 목록(Temple) – templeData는 이미 병합 완료된 배열 */
export const allTemples = temples;

/** 템플스테이 전체 목록(TempleStay) – Record → 배열 변환 */
export const allTempleStays: TempleStay[] = Object.values(templeStaysRecord);

/* ────────────────────────────────────────────────────────────
 * 3. 하위 모듈 재‑export
 * ────────────────────────────────────────────────────────────*/
export {
  // Temple‑domain
  temples,          // alias for templeData
  nearbyTemples,
  regionTags,
  newsData,

  // TempleStay‑domain
  templeStaysRecord as templeStays,
  locations,

  // Scripture‑domain
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,

  // 기타 공용
  regionSearchRankings,
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
};
