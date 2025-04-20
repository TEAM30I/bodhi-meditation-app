// src/repositories/searchRankingRepository.ts
import { supabase } from './supabase_client';

export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

// 하드코딩된 지역 검색 랭킹 데이터
export const regionSearchRankings: SearchRanking[] = [
  { id: "r1", term: "경주", count: 8452, trend: 'up' },
  { id: "r2", term: "서울", count: 7123, trend: 'same' },
  { id: "r3", term: "불국사", count: 5678, trend: 'up' },
  { id: "r4", term: "해인사", count: 4521, trend: 'down' },
  { id: "r5", term: "통도사", count: 3987, trend: 'up' },
  { id: "r6", term: "부산", count: 3654, trend: 'down' },
  { id: "r7", term: "양산", count: 2987, trend: 'new' },
  { id: "r8", term: "조계사", count: 2854, trend: 'up' },
  { id: "r9", term: "봉은사", count: 2753, trend: 'same' },
  { id: "r10", term: "속초", count: 2541, trend: 'down' }
];

// 하드코딩된 템플스테이 검색 랭킹 데이터
export const templeStaySearchRankings: SearchRanking[] = [
  { id: "ts1", term: "서울", count: 9876, trend: 'same' },
  { id: "ts2", term: "경주", count: 8765, trend: 'up' },
  { id: "ts3", term: "명상", count: 7654, trend: 'up' },
  { id: "ts4", term: "참선", count: 6543, trend: 'down' },
  { id: "ts5", term: "불국사", count: 5432, trend: 'up' },
  { id: "ts6", term: "당일", count: 4321, trend: 'new' },
  { id: "ts7", term: "해인사", count: 3210, trend: 'down' },
  { id: "ts8", term: "통도사", count: 2987, trend: 'same' },
  { id: "ts9", term: "1박2일", count: 2876, trend: 'up' },
  { id: "ts10", term: "송광사", count: 2654, trend: 'new' }
];

// Supabase에서 지역 검색 랭킹 가져오기
export async function getRegionSearchRankings(): Promise<SearchRanking[]> {
  try {
    // 커스텀 SQL 쿼리로 지역 검색 랭킹 가져오기
    //const { data, error } = await supabase.rpc('get_region_search_rankings');
    
    // 또는 직접 SQL 쿼리 실행
    const { data, error } = await supabase.from('search_history')
      .select('term, count(*) as count')
      .eq('category', 'region')
      .group('term')
      .order('count', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Error fetching region search rankings:', error);
      return regionSearchRankings; // 임시로 하드코딩된 데이터 반환
    }
    
    // 데이터 형식 변환 및 트렌드 계산
    const result = data.map((item, index) => ({
      id: `r${index + 1}`,
      term: item.term,
      count: parseInt(item.count),
      trend: determineTrend(item.term, 'region') // 트렌드 결정 함수 (아래 구현)
    }));
    
    return result;
  } catch (error) {
    console.error('Error in getRegionSearchRankings:', error);
    return regionSearchRankings; // 임시로 하드코딩된 데이터 반환
  }
}

// Supabase에서 템플스테이 검색 랭킹 가져오기
export async function getTempleStaySearchRankings(): Promise<SearchRanking[]> {
  try {
    // 커스텀 함수로 템플스테이 검색 랭킹 가져오기
    //const { data, error } = await supabase.rpc('get_temple_stay_search_rankings');
    
    // 또는 직접 SQL 쿼리 실행
    const { data, error } = await supabase.from('search_history')
      .select('term, count(*) as count')
      .eq('category', 'temple_stay')
      .group('term')
      .order('count', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Error fetching temple stay search rankings:', error);
      return templeStaySearchRankings; // 임시로 하드코딩된 데이터 반환
    }
    
    // 데이터 형식 변환 및 트렌드 계산
    const result = data.map((item, index) => ({
      id: `ts${index + 1}`,
      term: item.term,
      count: parseInt(item.count),
      trend: determineTrend(item.term, 'temple_stay')
    }));
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStaySearchRankings:', error);
    return templeStaySearchRankings; // 임시로 하드코딩된 데이터 반환
  }
}

// 검색어 추가 및 카운트 증가
export async function addSearchTerm(term: string, category: 'region' | 'temple_stay'): Promise<boolean> {
  try {
    // 검색 히스토리에 레코드 추가
    // const { error } = await supabase
    //   .from('search_history')
    //   .insert({
    //     user_id: getCurrentUserId(), // 현재 사용자 ID 얻는 함수 (별도 구현 필요)
    //     term: term.toLowerCase().trim(), // 소문자 변환 및 공백 제거
    //     category: category,
    //     searched_at: new Date().toISOString()
    //   });
      
    
    // 또는 RPC 함수 호출로 처리할 수도 있음
    const { error } = await supabase.rpc('record_search_term', {
      search_term: term.toLowerCase().trim(),
      search_category: category,
      user_id: getCurrentUserId()
    });

    if (error) {
        console.error('Error recording search term:', error);
        return false;
      }
    
    return true;
  } catch (error) {
    console.error('Error in addSearchTerm:', error);
    return false;
  }
}

// 트렌드 계산 함수
function determineTrend(term: string, category: 'region' | 'temple_stay'): 'up' | 'down' | 'new' | 'same' {
  // 실제로는 하드코딩된 데이터에서 트렌드 정보 찾기
  const rankings = category === 'region' ? regionSearchRankings : templeStaySearchRankings;
  const existingRanking = rankings.find(r => r.term === term);
  return existingRanking?.trend || 'new';
}

// 현재 사용자 ID 가져오기 (실제 구현 필요)
function getCurrentUserId(): string {
  // 실제로는 인증 상태에서 사용자 ID를 가져와야 함
  // 예: 로컬 스토리지, 상태 관리 라이브러리 등에서 가져오기
  return 'anonymous';
}

// 트렌드 업데이트 (일일 배치 작업으로 실행, 백엔드에서 작업)
export async function updateSearchTrends(): Promise<boolean> {
  try {
    // 이 함수는 실제로는 백엔드 스케줄러에서 실행되어야 함
    // Supabase Edge Functions나 외부 스케줄러로 실행
    const { error } = await supabase.rpc('update_search_trends');
    
    if (error) {
      console.error('Error updating search trends:', error);
      return false;
    }
    
    console.log('Search trends updated');
    return true;
  } catch (error) {
    console.error('Error in updateSearchTrends:', error);
    return false;
  }
}

// 특정 기간 동안의 검색 트렌드 분석 (선택적 기능)
export async function getSearchTrendAnalytics(
  category: 'region' | 'temple_stay',
  days: number = 7
): Promise<any> {
  try {
    const { data, error } = await supabase.rpc('get_search_trend_analytics', {
      search_category: category,
      days_back: days
    });
    
    if (error) {
      console.error('Error getting search trend analytics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getSearchTrendAnalytics:', error);
    return null;
  }
}