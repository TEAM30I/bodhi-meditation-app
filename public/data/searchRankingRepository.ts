
import { supabase } from './supabase_client';

export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

// 지역 검색 순위 가져오기 - 기반 데이터 사용
export async function getRegionSearchRankings(): Promise<SearchRanking[]> {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('id, temples!inner(*)')
      .order('searched_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching region search rankings:', error);
      return [];
    }

    // Group by region and count occurrences
    const regionCounts = new Map<string, number>();
    const regionIds = new Map<string, string>();

    data.forEach(item => {
      if (!item.temples || !item.temples.region) return;
      
      const region = item.temples.region.split(' ')[0]; // Extract first word (e.g., "서울특별시" -> "서울")
      const count = regionCounts.get(region) || 0;
      
      regionCounts.set(region, count + 1);
      regionIds.set(region, item.id); // Use search history id
    });

    // Convert to array, sort by count, and format as SearchRanking
    return Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([region, count], index) => ({
        id: regionIds.get(region) || `r${index}`,
        term: region,
        count,
        trend: 'up' // Assuming trend is up for now since we don't have historical data
      }));
  } catch (error) {
    console.error('Error in getRegionSearchRankings:', error);
    return [];
  }
}

// 템플스테이 검색 순위 가져오기 - 기반 데이터 사용
export async function getTempleStaySearchRankings(): Promise<SearchRanking[]> {
  try {
    const { data, error } = await supabase
      .from('search_stay_history')
      .select('id, temple_stays!inner(*)')
      .order('searched_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching temple stay search rankings:', error);
      return [];
    }

    // Group by region and count occurrences
    const regionCounts = new Map<string, number>();
    const regionIds = new Map<string, string>();

    data.forEach(item => {
      if (!item.temple_stays || !item.temple_stays.region) return;
      
      const region = item.temple_stays.region.split(' ')[0]; // Extract first word
      const count = regionCounts.get(region) || 0;
      
      regionCounts.set(region, count + 1);
      regionIds.set(region, item.id); // Use search history id
    });

    // Convert to array, sort by count, and format as SearchRanking
    return Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([region, count], index) => ({
        id: regionIds.get(region) || `ts${index}`,
        term: region,
        count,
        trend: 'up' // Assuming trend is up for now
      }));
  } catch (error) {
    console.error('Error in getTempleStaySearchRankings:', error);
    return [];
  }
}

// 검색어 추가 함수
export async function addSearchTerm(term: string, category: 'region' | 'temple_stay', entityId?: string): Promise<boolean> {
  try {
    if (category === 'region' && entityId) {
      // Add to temple search history
      const { error } = await supabase
        .from('search_history')
        .insert({ temple_id: entityId });
        
      if (error) {
        console.error('Error adding temple search history:', error);
        return false;
      }
      
      // Increment search count for the temple
      const { error: updateError } = await supabase
        .from('temples')
        .update({ search_count: supabase.rpc('increment', { row_id: entityId }) })
        .eq('id', entityId);
        
      if (updateError) {
        console.error('Error updating temple search count:', updateError);
      }
    } else if (category === 'temple_stay' && entityId) {
      // Add to temple stay search history
      const { error } = await supabase
        .from('search_stay_history')
        .insert({ temple_stay_id: entityId });
        
      if (error) {
        console.error('Error adding temple stay search history:', error);
        return false;
      }
      
      // Increment search count for the temple stay
      const { error: updateError } = await supabase
        .from('temple_stays')
        .update({ search_count: supabase.rpc('increment', { row_id: entityId }) })
        .eq('id', entityId);
        
      if (updateError) {
        console.error('Error updating temple stay search count:', updateError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in addSearchTerm:', error);
    return false;
  }
}
