// Temple Repository with Supabase Integration
import { supabase } from '../supabase_client';

// Interfaces for data types
export interface NewsItem {
  id: string;
  temple: string;
  source: string;
  title: string;
  link: string;
  date: string;
}

export interface Temple {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  distance?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  openingHours?: string;
  tags?: string[];
  hasParkingLot?: boolean;
  hasTempleStay?: boolean;
  direction?: string;
  websiteUrl?: string;
  likeCount?: number;
  facilities?: string[];
  nearbyAttractions?: string[];
  contact?: {
    phone?: string;
  };
  social?: {
    instagram?: string;
    facebook?: string;
  };
  latitude?: number;
  longitude?: number;
}

// Keep regionTags as it's used for UI filtering
export const regionTags = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "hapcheon", name: "합천", active: false },
  { id: "yangsan", name: "양산", active: false },
  { id: "suncheon", name: "순천", active: false }
];

// Supabase 데이터베이스에서 사찰 목록 가져오기
export async function getTempleList(): Promise<Temple[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*');
      
    if (error) {
      console.error('Error fetching temples:', error);
      return []; 
    }
    
    // Supabase 데이터를 기존 Temple 인터페이스에 맞게 변환
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region,
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
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      likeCount: item.follower_count,
      latitude: item.latitude,
      longitude: item.longitude
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
      location: item.region,
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
      location: item.region,
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
    await supabase.rpc('increment_temple_follower_count', { temple_id: templeId });
    
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
    await supabase.rpc('decrement_temple_follower_count', { temple_id: templeId });
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTemple:', error);
    return false;
  }
}

// 현재 사용자가 팔로우한 사찰 목록 가져오기
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
    
    return data.map(item => ({
      id: item.temples.id,
      name: item.temples.name,
      location: item.temples.region,
      imageUrl: item.temples.image_url,
      description: item.temples.description,
      likeCount: item.temples.follower_count,
      latitude: item.temples.latitude,
      longitude: item.temples.longitude
    }));
  } catch (error) {
    console.error('Error in getUserFollowedTemples:', error);
    return [];
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
      location: data.region,
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
export async function getNearbyTemples(latitude: number, longitude: number, limit = 4): Promise<Temple[]> {
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
        ...temple,
        distance: distance
      };
    });
    
    // 거리 기준 정렬
    const sortedTemples = templesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
    
    // 결과 형식 변환
    return sortedTemples.map(temple => ({
      id: temple.id,
      name: temple.name,
      location: temple.region,
      imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      description: temple.description,
      direction: temple.address,
      distance: formatDistance(temple.distance),
      likeCount: temple.follower_count,
      latitude: temple.latitude,
      longitude: temple.longitude
    }));
  } catch (error) {
    console.error('Error in getNearbyTemples:', error);
    return [];
  }
}

// 두 좌표 사이의 거리를 계산하는 함수 (Haversine 공식)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // 킬로미터 단위
  
  return distance;
}

// 각도를 라디안으로 변환
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// 거리 포맷팅 (1km 미만은 m로 표시)
function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}
