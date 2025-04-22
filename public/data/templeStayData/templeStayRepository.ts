// Temple Stay Repository with Supabase Integration
import { supabase } from '../supabase_client';

// 템플스테이 인터페이스
export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  direction: string;
  price: number;
  likeCount: number;
  description: string;
  duration: string;
  imageUrl: string;
  websiteUrl: string;
  schedule: {
    time: string;
    activity: string;
  }[];
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

// Fetch locations from database
export async function getLocations(): Promise<{ name: string; active: boolean }[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('name')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
    
    return data.map(location => ({
      name: location.name,
      active: false
    }));
  } catch (error) {
    console.error('Error in getLocations:', error);
    return [];
  }
}

// 템플스테이 목록 가져오기
export async function getTempleStayList(): Promise<TempleStay[]> {
  try {
    // temple_stays 테이블에서 데이터 가져오기
    const { data: templeStayData, error: templeStayError } = await supabase
      .from('temple_stays')
      .select('*');
      
    if (templeStayError) {
      console.error('Error fetching temple stays:', templeStayError);
      return [];
    }
    
    // 결과를 처리하고 포맷팅
    const result: TempleStay[] = [];
    
    for (const stay of templeStayData) {
      // 각 템플스테이에 대한 타임라인 데이터 가져오기
      const { data: timelineData, error: timelineError } = await supabase
        .from('timelines')
        .select('*')
        .eq('temple_stay_id', stay.id)
        .order('day', { ascending: true })
        .order('time', { ascending: true });
        
      if (timelineError) {
        console.error('Error fetching timelines:', timelineError);
        continue;
      }
      
      // 타임라인 데이터를 schedule 형식으로 변환
      const schedule = timelineData.map(item => ({
        time: item.time,
        activity: item.content
      }));
      
      // 템플스테이 객체 생성
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region,
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description,
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url,
        websiteUrl: stay.reservation_link,
        schedule: schedule,
        tags: stay.tags ? JSON.parse(stay.tags) : [],
        latitude: stay.latitude,
        longitude: stay.longitude
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStayList:', error);
    return [];
  }
}

// 인기 있는 템플스테이 가져오기
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
    
    const result: TempleStay[] = [];
    
    for (const stay of data) {
      // 대표적인 정보만 포함
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region,
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description,
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url,
        websiteUrl: stay.reservation_link,
        schedule: [], // 여기서는 스케줄 정보 생략
        tags: stay.tags ? JSON.parse(stay.tags) : [],
        latitude: stay.latitude,
        longitude: stay.longitude
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTopLikedTempleStays:', error);
    return [];
  }
}

// 템플스테이 검색
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
    
    const result: TempleStay[] = [];
    
    for (const stay of data) {
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region,
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description,
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url,
        websiteUrl: stay.reservation_link,
        schedule: [], // 상세 정보는 생략
        tags: stay.tags ? JSON.parse(stay.tags) : [],
        latitude: stay.latitude,
        longitude: stay.longitude
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in searchTempleStays:', error);
    return [];
  }
}

// 템플스테이 태그 기반 필터링
export async function filterTempleStaysByTag(tag: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .ilike('tags', `%${tag}%`);
      
    if (error) {
      console.error('Error filtering temple stays by tag:', error);
      return [];
    }
    
    const result: TempleStay[] = [];
    
    for (const stay of data) {
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region,
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description,
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url,
        websiteUrl: stay.reservation_link,
        schedule: [], // 상세 정보는 생략
        tags: stay.tags ? JSON.parse(stay.tags) : [],
        latitude: stay.latitude,
        longitude: stay.longitude
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in filterTempleStaysByTag:', error);
    return [];
  }
}

// 사용자 템플스테이 팔로우 기능
export async function followTempleStay(userId: string, templeStayId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temple_stays')
      .insert({ user_id: userId, temple_stay_id: templeStayId });
      
    if (error) {
      console.error('Error following temple stay:', error);
      return false;
    }
    
    // 팔로워 카운트 업데이트
    await supabase.rpc('increment_temple_stay_follower_count', { temple_stay_id: templeStayId });
    
    return true;
  } catch (error) {
    console.error('Error in followTempleStay:', error);
    return false;
  }
}

// 사용자 템플스테이 언팔로우 기능
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
    
    // 팔로워 카운트 감소
    await supabase.rpc('decrement_temple_stay_follower_count', { temple_stay_id: templeStayId });
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTempleStay:', error);
    return false;
  }
}

// 현재 사용자가 팔로우한 템플스테이 목록 가져오기
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
    
    const result: TempleStay[] = [];
    
    for (const item of data) {
      const stay = item.temple_stays;
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region,
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description,
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url,
        websiteUrl: stay.reservation_link,
        schedule: [], // 상세 정보는 생략
        tags: stay.tags ? JSON.parse(stay.tags) : [],
        latitude: stay.latitude,
        longitude: stay.longitude
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getUserFollowedTempleStays:', error);
    return [];
  }
}

// 템플스테이 상세 정보 가져오기 (스케줄 포함)
export async function getTempleStayDetail(id: string): Promise<TempleStay | null> {
  try {
    // 템플스테이 기본 정보 가져오기
    const { data: stayData, error: stayError } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('id', id)
      .single();
      
    if (stayError) {
      console.error('Error fetching temple stay details:', stayError);
      return null;
    }
    
    // 스케줄 정보 가져오기
    const { data: timelineData, error: timelineError } = await supabase
      .from('timelines')
      .select('*')
      .eq('temple_stay_id', id)
      .order('day', { ascending: true })
      .order('time', { ascending: true });
      
    if (timelineError) {
      console.error('Error fetching temple stay timeline:', timelineError);
      // 오류 시 기본 정보만 반환
      const emptySchedule = [];
      return {
        id: stayData.id,
        templeName: stayData.name,
        location: stayData.region,
        direction: stayData.public_transportation || '',
        price: parseInt(stayData.cost_adult) || 0,
        likeCount: stayData.follower_count || 0,
        description: stayData.description,
        duration: stayData.start_date && stayData.end_date ? `${stayData.start_date}~${stayData.end_date}` : '당일',
        imageUrl: stayData.image_url,
        websiteUrl: stayData.reservation_link,
        schedule: emptySchedule,
        tags: stayData.tags ? JSON.parse(stayData.tags) : [],
        latitude: stayData.latitude,
        longitude: stayData.longitude
      };
    }
    
    // 결과 조합
    const schedule = timelineData.map(item => ({
      time: item.time,
      activity: item.content
    }));
    
    return {
      id: stayData.id,
      templeName: stayData.name,
      location: stayData.region,
      direction: stayData.public_transportation || '',
      price: parseInt(stayData.cost_adult) || 0,
      likeCount: stayData.follower_count || 0,
      description: stayData.description,
      duration: stayData.start_date && stayData.end_date ? `${stayData.start_date}~${stayData.end_date}` : '당일',
      imageUrl: stayData.image_url,
      websiteUrl: stayData.reservation_link,
      schedule: schedule,
      tags: stayData.tags ? JSON.parse(stayData.tags) : [],
      latitude: stayData.latitude,
      longitude: stayData.longitude
    };
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    return null;
  }
}

// 특정 지역의 템플스테이 가져오기
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
    
    const result: TempleStay[] = [];
    
    for (const stay of data) {
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region,
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description,
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url,
        websiteUrl: stay.reservation_link,
        schedule: [], // 여기서는 스케줄 정보는 생략
        tags: stay.tags ? JSON.parse(stay.tags) : [],
        latitude: stay.latitude,
        longitude: stay.longitude
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    return [];
  }
}

// 현재 위치 기반 근처 템플스테이 가져오기
export async function getNearbyTempleStays(latitude: number, longitude: number, limit = 4): Promise<TempleStay[]> {
  try {
    // 먼저 모든 템플스테이를 가져옴
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*');
    
    if (error) {
      console.error('Error fetching temple stays for nearby calculation:', error);
      return [];
    }
    
    // 위치 정보를 가진 템플스테이만 필터링
    const staysWithLocation = data.filter(stay => 
      stay.latitude && stay.longitude
    );
    
    // 각 템플스테이까지의 거리 계산
    const staysWithDistance = staysWithLocation.map(stay => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        stay.latitude!, 
        stay.longitude!
      );
      
      return {
        ...stay,
        distance: distance
      };
    });
    
    // 거리 기준 정렬
    const sortedStays = staysWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
    
    // 결과 형식 변환
    return sortedStays.map(stay => ({
      id: stay.id,
      templeName: stay.name,
      location: stay.region,
      direction: stay.public_transportation || '',
      price: parseInt(stay.cost_adult) || 0,
      likeCount: stay.follower_count || 0,
      description: stay.description,
      duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
      imageUrl: stay.image_url,
      websiteUrl: stay.reservation_link,
      schedule: [],
      tags: stay.tags ? JSON.parse(stay.tags) : [],
      distance: formatDistance(stay.distance),
      latitude: stay.latitude,
      longitude: stay.longitude
    }));
  } catch (error) {
    console.error('Error in getNearbyTempleStays:', error);
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
