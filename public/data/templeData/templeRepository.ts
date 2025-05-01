// Temple Repository with Supabase Integration
import { supabase } from '../supabase_client';
import { calculateDistance, formatDistance } from '../../../src/utils/locationUtils';

// Default location to use for distance calculations (서울특별시 관악구 신림로 72)
const DEFAULT_LOCATION = {
  latitude: 37.4812845,
  longitude: 126.9292231
};

// Interfaces for data types
export interface Temple {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  distance?: string;
  description?: string;
  openingHours?: string;
  tags?: string[];
  direction?: string;
  websiteUrl?: string;
  likeCount?: number;
  facilities?: string[];
  contact?: {
    phone?: string;
  };
  latitude?: number;
  longitude?: number;
}

// Structure for region tags that will be populated from database
export interface RegionTag {
  id: string;
  name: string;
  active: boolean;
}

// Export regionTags for UI components that need immediate access
// This will be populated with data from the database rather than hardcoded
export const regionTags: RegionTag[] = [];

// Initialize regionTags on module load
(async () => {
  try {
    const tags = await getRegionTags();
    // Clear the array and add the fetched tags
    regionTags.length = 0;
    regionTags.push(...tags);
  } catch (error) {
    console.error('Error initializing regionTags array:', error);
  }
})();

// 정렬 유형
export type TempleSort = 'popular' | 'recent' | 'distance';

// Get all regions as an array 
export async function getRegionTags(): Promise<RegionTag[]> {
  try {
    const regions = await getTempleRegions();
    return regions.map((region, index) => ({
      id: `region-${index}`,
      name: region,
      active: index === 0
    }));
  } catch (error) {
    console.error('Error getting region tags:', error);
    return [];
  }
}

// Supabase 데이터베이스에서 사찰 목록 가져오기
export async function getTempleList(sortBy: TempleSort = 'popular'): Promise<Temple[]> {
  try {
    let query = supabase.from('temples').select('*');
    
    if (sortBy === 'popular') {
      query = query.order('follower_count', { ascending: false });
    } else if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching temples:', error);
      return []; 
    }
    
    let temples = data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region, // Map region to location for interface compliance
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      description: item.description,
      direction: item.address,
      likeCount: item.follower_count,
      contact: {
        phone: item.contact
      },
      latitude: item.latitude,
      longitude: item.longitude,
      facilities: item.facilities ? JSON.parse(item.facilities) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      openingHours: item.opening_hours,
      websiteUrl: item.website_url
    }));
    
    // Sort by distance if needed (after we have the data with coordinates)
    if (sortBy === 'distance') {
      temples = temples
        .filter(temple => temple.latitude && temple.longitude)
        .map(temple => {
          const distance = calculateDistance(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            temple.latitude!,
            temple.longitude!
          );
          return { ...temple, distance: formatDistance(distance) };
        })
        .sort((a, b) => {
          const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
          const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
          return distA - distB;
        });
    }
    
    return temples;
  } catch (error) {
    console.error('Error in getTempleList:', error);
    return []; 
  }
}

// Supabase에서 좋아요 기준으로 정렬된 사찰 목록 가져오기
export async function getTopLikedTemples(limit = 5): Promise<Temple[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .order('follower_count', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching top liked temples:', error);
      return [];
    }
    
    return data.map(temple => ({
      id: temple.id,
      name: temple.name,
      location: temple.region, // Map region to location for interface compliance
      imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      likeCount: temple.follower_count,
      direction: temple.address,
      description: temple.description
    }));
  } catch (error) {
    console.error('Error in getTopLikedTemples:', error);
    return [];
  }
}

// 사찰 태그 기반 필터링
export async function filterTemplesByTag(tag: string): Promise<Temple[]> {
  try {
    // 태그 필드가 JSON 배열로 저장되어 있을 경우 유의
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .ilike('tags', `%${tag}%`);
      
    if (error) {
      console.error('Error filtering temples by tag:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region, // Map region to location for interface compliance
      imageUrl: item.image_url,
      description: item.description,
      likeCount: item.follower_count,
      contact: {
        phone: item.contact
      },
      latitude: item.latitude,
      longitude: item.longitude
    }));
  } catch (error) {
    console.error('Error in filterTemplesByTag:', error);
    return [];
  }
}

// 사찰 검색 기능
export async function searchTemples(query: string): Promise<Temple[]> {
  if (!query) return [];
  
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .or(`name.ilike.%${query}%,region.ilike.%${query}%,description.ilike.%${query}%`);
      
    if (error) {
      console.error('Error searching temples:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region, // Map region to location for interface compliance
      imageUrl: item.image_url,
      description: item.description,
      likeCount: item.follower_count,
      contact: {
        phone: item.contact
      },
      latitude: item.latitude,
      longitude: item.longitude
    }));
  } catch (error) {
    console.error('Error in searchTemples:', error);
    return [];
  }
}

// 사용자 사찰 팔로우 기능
export async function followTemple(userId: string, templeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temples')
      .insert({ user_id: userId, temple_id: templeId });
      
    if (error) {
      console.error('Error following temple:', error);
      return false;
    }
    
    // 팔로워 카운트 업데이트
    const { error: updateError } = await supabase
      .from('temples')
      .update({ follower_count: supabase.rpc('increment', { row_id: templeId }) })
      .eq('id', templeId);
      
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in followTemple:', error);
    return false;
  }
}

// 사용자 사찰 언팔로우 기능
export async function unfollowTemple(userId: string, templeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temples')
      .delete()
      .eq('user_id', userId)
      .eq('temple_id', templeId);
      
    if (error) {
      console.error('Error unfollowing temple:', error);
      return false;
    }
    
    // 팔로워 카운트 감소
    const { error: updateError } = await supabase
      .from('temples')
      .update({ follower_count: supabase.rpc('decrement', { row_id: templeId }) })
      .eq('id', templeId);
      
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTemple:', error);
    return false;
  }
}

// 사찰 상세 정보 가져오기
export async function getTempleDetail(id: string): Promise<Temple | null> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching temple details:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      location: data.region, // Map region to location for interface compliance
      imageUrl: data.image_url,
      description: data.description,
      direction: data.address,
      likeCount: data.follower_count,
      contact: {
        phone: data.contact
      },
      openingHours: data.opening_hours,
      tags: data.tags ? JSON.parse(data.tags) : [],
      facilities: data.facilities ? JSON.parse(data.facilities) : [],
      websiteUrl: data.website_url,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error in getTempleDetail:', error);
    return null;
  }
}

// 현재 위치 기반으로 근처 사찰 가져오기
export async function getNearbyTemples(
  latitude: number = DEFAULT_LOCATION.latitude, 
  longitude: number = DEFAULT_LOCATION.longitude, 
  limit = 4
): Promise<Temple[]> {
  try {
    // 먼저 모든 사찰을 가져옴
    const { data, error } = await supabase
      .from('temples')
      .select('*');
    
    if (error) {
      console.error('Error fetching temples for nearby calculation:', error);
      return [];
    }
    
    // 위치 정보를 가진 사찰만 필터링
    const templesWithLocation = data.filter(temple => 
      temple.latitude && temple.longitude
    );
    
    // 각 사찰까지의 거리 계산
    const templesWithDistance = templesWithLocation.map(temple => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        temple.latitude!, 
        temple.longitude!
      );
      
      return {
        id: temple.id,
        name: temple.name,
        location: temple.region, // Map region to location for interface compliance
        imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
        description: temple.description,
        direction: temple.address,
        distance: formatDistance(distance),
        likeCount: temple.follower_count,
        latitude: temple.latitude,
        longitude: temple.longitude
      };
    });
    
    // 거리 기준 정렬
    return templesWithDistance
      .sort((a, b) => {
        const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
        const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
        return distA - distB;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getNearbyTemples:', error);
    return [];
  }
}

// Get user followed temples
export async function getUserFollowedTemples(userId: string): Promise<Temple[]> {
  try {
    const { data, error } = await supabase
      .from('user_follow_temples')
      .select('temple_id, temples(*)')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user followed temples:', error);
      return [];
    }
    
    // Check if data exists and is not empty
    if (!data || data.length === 0) {
      return [];
    }

    // Map data to the expected format with proper type checking
    const temples = data
      .filter(item => item && item.temples)
      .map(item => {
        const temple = item.temples as any;
        
        return {
          id: temple.id,
          name: temple.name,
          location: temple.region,
          imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
          description: temple.description,
          likeCount: temple.follower_count,
          direction: temple.address,
          latitude: temple.latitude,
          longitude: temple.longitude
        };
      });
      
    return temples;
  } catch (error) {
    console.error('Error in getUserFollowedTemples:', error);
    return [];
  }
}

// Get temple regions from database
export async function getTempleRegions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('region')
      .not('region', 'is', null)
      .order('region', { ascending: true });
    
    if (error) {
      console.error('Error fetching temple regions:', error);
      return [];
    }
    
    // Extract unique regions
    const regions = [...new Set(data.map(item => item.region).filter(Boolean))];
    return regions;
  } catch (error) {
    console.error('Error in getTempleRegions:', error);
    return [];
  }
}

// Get top regions
export async function getTopRegions(limit = 8): Promise<{name: string, count: number}[]> {
  try {
    const { data: templeData, error: templeError } = await supabase
      .from('temples')
      .select('region, follower_count, search_count');
      
    if (templeError) {
      console.error('Error fetching temple regions:', templeError);
      return [];
    }
    
    // Group by region and sum follower_count and search_count
    const regionCounts = templeData.reduce((acc, temple) => {
      if (temple.region) {
        if (!acc[temple.region]) {
          acc[temple.region] = {
            followerCount: 0,
            searchCount: 0
          };
        }
        acc[temple.region].followerCount += temple.follower_count || 0;
        acc[temple.region].searchCount += temple.search_count || 0;
      }
      return acc;
    }, {} as Record<string, {followerCount: number, searchCount: number}>);
    
    // Transform to array and sort by combined count
    const result = Object.entries(regionCounts)
      .map(([name, counts]) => ({
        name,
        count: counts.followerCount + counts.searchCount
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return result;
  } catch (error) {
    console.error('Error in getTopRegions:', error);
    return [];
  }
}
