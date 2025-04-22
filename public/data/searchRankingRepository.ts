
import { supabase } from './supabase_client';

/**
 * Get region search rankings by combining follower_count and search_count from the temples table
 */
export async function getRegionSearchRankings(limit = 8): Promise<{name: string, count: number}[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('region, follower_count, search_count');
      
    if (error) {
      console.error('Error fetching region rankings:', error);
      return [];
    }
    
    // Group by region and sum the follower and search counts
    const regions = data.reduce((acc, temple) => {
      if (temple.region) {
        if (!acc[temple.region]) {
          acc[temple.region] = {
            count: 0
          };
        }
        
        acc[temple.region].count += (temple.follower_count || 0) + (temple.search_count || 0);
      }
      return acc;
    }, {} as Record<string, {count: number}>);
    
    // Convert to array and sort
    return Object.entries(regions)
      .map(([name, data]) => ({
        name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getRegionSearchRankings:', error);
    return [];
  }
}

/**
 * Get temple stay search rankings by combining follower_count and search_count from the temple_stays table
 */
export async function getTempleStaySearchRankings(limit = 8): Promise<{name: string, count: number}[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('region, follower_count, search_count');
      
    if (error) {
      console.error('Error fetching temple stay rankings:', error);
      return [];
    }
    
    // Group by region and sum the follower and search counts
    const regions = data.reduce((acc, templeStay) => {
      if (templeStay.region) {
        if (!acc[templeStay.region]) {
          acc[templeStay.region] = {
            count: 0
          };
        }
        
        acc[templeStay.region].count += (templeStay.follower_count || 0) + (templeStay.search_count || 0);
      }
      return acc;
    }, {} as Record<string, {count: number}>);
    
    // Convert to array and sort
    return Object.entries(regions)
      .map(([name, data]) => ({
        name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getTempleStaySearchRankings:', error);
    return [];
  }
}

/**
 * Add a search term to the database to track popularity
 */
export async function addSearchTerm(term: string, type: 'temple' | 'temple-stay'): Promise<void> {
  // Note: This functionality would normally update the search_count in the respective tables
  // For now, this is a placeholder for future implementation
  try {
    if (type === 'temple') {
      await supabase
        .from('temples')
        .update({ search_count: supabase.rpc('increment', { row_id: term }) })
        .eq('name', term);
    } else {
      await supabase
        .from('temple_stays')
        .update({ search_count: supabase.rpc('increment', { row_id: term }) })
        .eq('name', term);
    }
  } catch (error) {
    console.error('Error recording search term:', error);
  }
}

export interface SearchRanking {
  id: string;
  name: string;
  count: number;
}
