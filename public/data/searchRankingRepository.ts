
import { supabase } from './supabase_client';

export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

// Supabase에서 지역 검색 랭킹 가져오기
export async function getRegionSearchRankings(): Promise<SearchRanking[]> {
  try {
    const { data, error } = await supabase.from('search_history')
      .select('term, count(*) as count')
      .eq('category', 'region')
      .group('term')
      .order('count', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Error fetching region search rankings:', error);
      return []; 
    }
    
    // 트렌드 정보를 가져옴
    const { data: trendsData, error: trendsError } = await supabase.from('search_trends')
      .select('term, trend')
      .eq('category', 'region');
      
    if (trendsError) {
      console.error('Error fetching region search trends:', trendsError);
    }
    
    // 트렌드 정보와 결합
    const result = data.map((item, index) => {
      // 트렌드 정보 찾기
      const trendInfo = trendsData?.find(t => t.term === item.term);
      
      return {
        id: `r${index + 1}`,
        term: item.term,
        count: parseInt(item.count),
        trend: (trendInfo?.trend as 'up' | 'down' | 'new' | 'same') || 'same'
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error in getRegionSearchRankings:', error);
    return [];
  }
}

// Supabase에서 템플스테이 검색 랭킹 가져오기
export async function getTempleStaySearchRankings(): Promise<SearchRanking[]> {
  try {
    const { data, error } = await supabase.from('search_history')
      .select('term, count(*) as count')
      .eq('category', 'temple_stay')
      .group('term')
      .order('count', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Error fetching temple stay search rankings:', error);
      return [];
    }
    
    // 트렌드 정보를 가져옴
    const { data: trendsData, error: trendsError } = await supabase.from('search_trends')
      .select('term, trend')
      .eq('category', 'temple_stay');
      
    if (trendsError) {
      console.error('Error fetching temple stay search trends:', trendsError);
    }
    
    // 트렌드 정보와 결합
    const result = data.map((item, index) => {
      // 트렌드 정보 찾기
      const trendInfo = trendsData?.find(t => t.term === item.term);
      
      return {
        id: `ts${index + 1}`,
        term: item.term,
        count: parseInt(item.count),
        trend: (trendInfo?.trend as 'up' | 'down' | 'new' | 'same') || 'same'
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStaySearchRankings:', error);
    return [];
  }
}

// 검색어 추가 및 카운트 증가
export async function addSearchTerm(term: string, category: 'region' | 'temple_stay'): Promise<boolean> {
  try {
    // 검색 히스토리에 레코드 추가
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: getCurrentUserId(), // 현재 사용자 ID 얻는 함수
        term: term.toLowerCase().trim(), // 소문자 변환 및 공백 제거
        category: category,
        searched_at: new Date().toISOString()
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

// 현재 사용자 ID 가져오기
function getCurrentUserId(): string {
  // 사용자 세션에서 ID 가져오기 시도
  try {
    const session = supabase.auth.getSession();
    // @ts-ignore - 비동기 함수이므로 실제 구현에서는 async/await 사용해야 함
    return session?.data?.session?.user?.id || 'anonymous';
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return 'anonymous';
  }
}

// 트렌드 업데이트 (일일 배치 작업으로 실행, 백엔드에서 작업)
export async function updateSearchTrends(): Promise<boolean> {
  try {
    // 이 함수는 실제로는 백엔드 스케줄러에서 실행되어야 함
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

// 특정 기간 동안의 검색 트렌드 분석
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
