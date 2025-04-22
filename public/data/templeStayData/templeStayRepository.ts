
// TempleStay Repository with Supabase Integration
import { supabase } from '../supabase_client';
import { calculateDistance, formatDistance } from '../../../src/utils/locationUtils';

// Default location to use for distance calculations (서울특별시 관악구 신림로 72)
const DEFAULT_LOCATION = {
  latitude: 37.4812845,
  longitude: 126.9292231
};

// Interface for TempleStay data type
export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  imageUrl: string;
  price: number;
  description?: string;
  schedule?: Array<{
    time: string;
    activity: string;
    day?: number;
  }>;
  direction?: string;
  facilities?: string[];
  likeCount?: number;
  distance?: string;
  longitude?: number;
  latitude?: number;
  tags?: string[];
  duration?: string;
  websiteUrl?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
}

// Locations for filtering (will be fetched from API)
export const locations = [
  "서울",
  "경주",
  "부산",
  "합천",
  "양산",
  "순천"
];

// Sort types
export type TempleStaySort = 'popular' | 'recent' | 'price-asc' | 'price-desc' | 'distance';

// Fetch temple stays from Supabase
export async function getTempleStayList(sortBy: TempleStaySort = 'popular'): Promise<TempleStay[]> {
  try {
    let query = supabase.from('temple_stays').select('*');
    
    if (sortBy === 'popular') {
      query = query.order('follower_count', { ascending: false });
    } else if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'price-asc') {
      query = query.order('cost_adult', { ascending: true });
    } else if (sortBy === 'price-desc') {
      query = query.order('cost_adult', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching temple stays:', error);
      return [];
    }
    
    // Map database results to TempleStay type
    let templeStays = data.map(item => {
      return {
        id: item.id,
        templeName: item.name,
        location: item.region,
        imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
        price: parseInt(item.cost_adult) || 50000,
        description: item.description,
        likeCount: item.follower_count,
        direction: item.public_transportation,
        longitude: item.longitude,
        latitude: item.latitude,
        websiteUrl: item.reservation_link
      };
    });
    
    // If sort by distance, calculate distances and sort
    if (sortBy === 'distance') {
      templeStays = templeStays
        .filter(stay => stay.latitude && stay.longitude)
        .map(stay => {
          const distance = calculateDistance(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            stay.latitude!,
            stay.longitude!
          );
          return { ...stay, distance: formatDistance(distance) };
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
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .or(`name.ilike.%${query}%,region.ilike.%${query}%,description.ilike.%${query}%`);
    
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
      direction: item.public_transportation
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
    
    return data.map(item => {
      const templeStay = item.temple_stays;
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
