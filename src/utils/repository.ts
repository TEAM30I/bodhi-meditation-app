// Importing from our centralized repository file
import {
  Temple,
  TempleStay,
  NewsItem,
  Scripture,
  Bookmark,
  ReadingProgress,
  SearchRanking,
  ScriptureColorScheme,
  
  // Repository functions
  getTempleList as getTempleListOriginal,
  getTempleDetail as getTempleDetailOriginal,
  searchTemples as searchTemplesOriginal,
  filterTemplesByTag as filterTemplesByTagOriginal,
  followTemple as followTempleOriginal,
  unfollowTemple as unfollowTempleOriginal,
  getTempleStayList as getTempleStayListOriginal,
  getTempleStayDetail as getTempleStayDetailOriginal,
  searchTempleStays as searchTempleStaysOriginal,
  filterTempleStaysByTag as filterTempleStaysByTagOriginal,
  followTempleStay as followTempleStayOriginal,
  unfollowTempleStay as unfollowTempleStayOriginal,
} from '../data/dataRepository';

import { searchTemplesDirectly, searchTempleStaysDirectly } from '@/integrations/supabase/client';

// Re-export types
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

// Temple related functions
export const getTempleList = getTempleListOriginal;
export const getTempleDetail = getTempleDetailOriginal;

// Updated search function to use direct Supabase connection
export const searchTemples = async (query: string): Promise<Temple[]> => {
  try {
    const { data, error } = await searchTemplesDirectly(query);
    if (error) {
      console.error('Error searching temples:', error);
      return [];
    }
    return data as Temple[];
  } catch (error) {
    console.error('Exception searching temples:', error);
    return [];
  }
};

export const filterTemplesByTag = filterTemplesByTagOriginal;
export const followTemple = followTempleOriginal;
export const unfollowTemple = unfollowTempleOriginal;

// Temple Stay related functions
export const getTempleStayList = getTempleStayListOriginal;
export const getTempleStayDetail = getTempleStayDetailOriginal;

// Updated search function for temple stays
export const searchTempleStays = async (query: string): Promise<TempleStay[]> => {
  try {
    const { data, error } = await searchTempleStaysDirectly(query);
    if (error) {
      console.error('Error searching temple stays:', error);
      return [];
    }
    return data as TempleStay[];
  } catch (error) {
    console.error('Exception searching temple stays:', error);
    return [];
  }
};

export const filterTempleStaysByTag = filterTempleStaysByTagOriginal;
export const followTempleStay = followTempleStayOriginal;
export const unfollowTempleStay = unfollowTempleStayOriginal;

// 검색 순위 관련 타입 정의
export interface SearchRanking {
  term: string;
  count: number;
}

// 임시 검색 순위 데이터 (실제 데이터베이스 함수 구현 전까지 사용)
const tempRegionSearchRankings: SearchRanking[] = [
  { term: '서울', count: 120 },
  { term: '부산', count: 95 },
  { term: '경주', count: 88 },
  { term: '강원도', count: 76 },
  { term: '전주', count: 62 },
];

const tempTempleStaySearchRankings: SearchRanking[] = [
  { term: '템플라이프', count: 85 },
  { term: '휴식형', count: 72 },
  { term: '명상', count: 65 },
  { term: '체험형', count: 54 },
  { term: '당일형', count: 47 },
];

// 검색 순위 관련 함수들 (임시 데이터 반환)
export const getRegionSearchRankings = async (): Promise<SearchRanking[]> => {
  try {
    // 이후 실제 Supabase 함수 구현 시 여기를 수정
    return tempRegionSearchRankings;
  } catch (error) {
    console.error('Error fetching region search rankings:', error);
    return [];
  }
};

export const getTempleStaySearchRankings = async (): Promise<SearchRanking[]> => {
  try {
    // 이후 실제 Supabase 함수 구현 시 여기를 수정
    return tempTempleStaySearchRankings;
  } catch (error) {
    console.error('Error fetching temple stay search rankings:', error);
    return [];
  }
};

// 검색어 추가 함수 (임시 로직)
export const addSearchTerm = async (
  term: string,
  type: 'region' | 'temple_stay'
): Promise<void> => {
  try {
    // 이후 실제 Supabase 함수 구현 시 여기를 수정
    console.log(`Added search term: ${term} (${type})`);
  } catch (error) {
    console.error('Error recording search term:', error);
  }
};
