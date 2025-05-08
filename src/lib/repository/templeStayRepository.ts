// TempleStay Repository with Supabase Integration
import { supabase } from '@/lib/supabase';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { TempleStay, TempleStaySort } from '@/types';
import { DEFAULT_LOCATION, DEFAULT_IMAGES } from '@/constants';

// Get all available regions for UI location selection
export async function getTempleStayLocations(): Promise<string[]> {
  try {
    const regions = await getTempleStayRegions();
    return regions;
  } catch (error) {
    console.error('Error fetching temple stay locations:', error);
    return [];
  }
}

// Fetch temple stays from Supabase
export async function getTempleStayList(sortBy: TempleStaySort = 'popular'): Promise<TempleStay[]> {
  try {
    // temple_stays와 temples 테이블을 조인하여 데이터 가져오기
    let query = supabase
      .from('temple_stays')
      .select(`
        *,
        temples:temple_id (
          id,
          name,
          region,
          address,
          image_url
        )
      `);
    
    if (sortBy === 'popular') {
      query = query.order('follower_count', { ascending: false });
    } else if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'price') {
      query = query.order('price', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching temple stays:', error);
      return [];
    }
    
    let templeStays = data.map(item => ({
      id: item.id,
      templeName: item.temple_name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      description: item.description,
      likeCount: item.follower_count,
      direction: item.public_transportation,
      temple: item.temples ? {
        id: item.temples.id,
        name: item.temples.name,
        region: item.temples.region,
        address: item.temples.address,
        imageUrl: item.temples.image_url
      } : null,
      // 기존 필드들 유지
      longitude: item.longitude,
      latitude: item.latitude
    }));
    
    // If sort by distance, calculate distances and sort
    if (sortBy === 'distance') {
      templeStays = templeStays
        .filter(templeStay => templeStay.latitude && templeStay.longitude)
        .map(templeStay => {
          const distance = calculateDistance(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            templeStay.latitude!,
            templeStay.longitude!
          );
          return { ...templeStay, distance: formatDistance(distance) };
        })
        .sort((a, b) => {
          const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
          const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
          return distA - distB;
        });
    }
    
    return templeStays;
  } catch (error) {
    console.error('Error in getTempleStayList:', error);
    return [];
  }
}

// Fetch temple stay detail by ID
export async function getTempleStayDetail(id: string): Promise<TempleStay | null> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching temple stay details:', error);
      return null;
    }
    
    // Also fetch schedule if available
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('timelines')
      .select('*')
      .eq('temple_stay_id', id)
      .order('day', { ascending: true })
      .order('time', { ascending: true });
    
    if (scheduleError) {
      console.error('Error fetching temple stay schedule:', scheduleError);
    }
    
    const schedule = scheduleData ? scheduleData.map(item => ({
      time: item.time,
      activity: item.content,
      day: item.day
    })) : [];
    
    const templeStay: TempleStay = {
      id: data.id,
      templeName: data.name,
      location: data.region,
      imageUrl: data.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(data.cost_adult) || 50000,
      description: data.description,
      likeCount: data.follower_count,
      direction: data.public_transportation,
      schedule: schedule,
      longitude: data.longitude,
      latitude: data.latitude,
      facilities: data.facilities ? JSON.parse(data.facilities) : [],
      tags: data.tags ? JSON.parse(data.tags) : [],
      websiteUrl: data.reservation_link,
      contact: {
        phone: data.contact
      }
    };
    
    return templeStay;
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    return null;
  }
}

// Search temple stays by text query
export async function searchTempleStays(query: string): Promise<TempleStay[]> {
  if (!query) return [];
  
  try {
    // 템플스테이 테이블과 사찰 테이블을 조인하여 검색
    const { data, error } = await supabase
      .from('temple_stays')
      .select(`
        *,
        temples:temple_id (
          id,
          name,
          region,
          address,
          image_url
        )
      `)
      .or(`
        name.ilike.%${query}%,
        region.ilike.%${query}%,
        description.ilike.%${query}%,
        temples.name.ilike.%${query}%,
        temples.region.ilike.%${query}%,
        temples.address.ilike.%${query}%
      `);
    
    if (error) {
      console.error('Error searching temple stays:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation,
      temple: item.temples ? {
        id: item.temples.id,
        name: item.temples.name,
        region: item.temples.region,
        address: item.temples.address,
        imageUrl: item.temples.image_url
      } : null
    }));
  } catch (error) {
    console.error('Error in searchTempleStays:', error);
    return [];
  }
}

// Filter temple stays by tag
export async function filterTempleStaysByTag(tag: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('region', tag);
    
    if (error) {
      console.error('Error filtering temple stays by tag:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation
    }));
  } catch (error) {
    console.error('Error in filterTempleStaysByTag:', error);
    return [];
  }
}

// Get temple stays by region
export async function getTempleStaysByRegion(region: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('region', region);
    
    if (error) {
      console.error('Error fetching temple stays by region:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation
    }));
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    return [];
  }
}

// Follow temple stay
export async function followTempleStay(userId: string, templeStayId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temple_stays')
      .insert({ user_id: userId, temple_stay_id: templeStayId });
    
    if (error) {
      console.error('Error following temple stay:', error);
      return false;
    }
    
    // Update follower count
    const { error: updateError } = await supabase
      .from('temple_stays')
      .update({ follower_count: supabase.rpc('increment', { row_id: templeStayId }) })
      .eq('id', templeStayId);
    
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in followTempleStay:', error);
    return false;
  }
}

// Unfollow temple stay
export async function unfollowTempleStay(userId: string, templeStayId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temple_stays')
      .delete()
      .eq('user_id', userId)
      .eq('temple_stay_id', templeStayId);
    
    if (error) {
      console.error('Error unfollowing temple stay:', error);
      return false;
    }
    
    // Update follower count
    const { error: updateError } = await supabase
      .from('temple_stays')
      .update({ follower_count: supabase.rpc('decrement', { row_id: templeStayId }) })
      .eq('id', templeStayId);
    
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTempleStay:', error);
    return false;
  }
}

// Get user followed temple stays
export async function getUserFollowedTempleStays(userId: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('user_follow_temple_stays')
      .select('temple_stay_id, temple_stays(*)')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user followed temple stays:', error);
      return [];
    }
    
    // Check if data exists and is not empty
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map data to the expected format with proper type checking
    const templeStays = data
      .filter(item => item && item.temple_stays)
      .map(item => {
        const templeStay = item.temple_stays as any;
        
        return {
          id: templeStay.id,
          templeName: templeStay.name,
          location: templeStay.region,
          imageUrl: templeStay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
          price: parseInt(templeStay.cost_adult) || 50000,
          likeCount: templeStay.follower_count,
          direction: templeStay.public_transportation
        };
      });
      
    return templeStays;
  } catch (error) {
    console.error('Error in getUserFollowedTempleStays:', error);
    return [];
  }
}

// Get top liked temple stays
export async function getTopLikedTempleStays(limit = 5): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .order('follower_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top liked temple stays:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation
    }));
  } catch (error) {
    console.error('Error in getTopLikedTempleStays:', error);
    return [];
  }
}

// Get all available regions from database
export async function getTempleStayRegions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('region')
      .not('region', 'is', null)
      .order('region', { ascending: true });
    
    if (error) {
      console.error('Error fetching temple stay regions:', error);
      return [];
    }
    
    // Extract unique regions
    const regions = [...new Set(data.map(item => item.region).filter(Boolean))];
    return regions;
  } catch (error) {
    console.error('Error in getTempleStayRegions:', error);
    return [];
  }
}

// Export empty locations array for backward compatibility
// This will be filled by the getTempleStayLocations function instead of being hardcoded
export const locations: string[] = [];
