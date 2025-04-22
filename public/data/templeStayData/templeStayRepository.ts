
import { supabase } from '../supabase_client';
import { calculateDistance, formatDistance, DEFAULT_LOCATION } from '../../../src/utils/locationUtils';

// Define types
export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  imageUrl: string;
  price: number;
  duration?: string;
  description?: string;
  tags?: string[];
  websiteUrl?: string;
  likeCount?: number;
  schedule?: Array<{time: string, activity: string}>;
  direction?: string;
  distance?: string;
}

// 정렬 유형
export type TempleStaySort = 'popular' | 'recent' | 'distance';

// Locations for filtering (from database)
export const locations = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "jeju", name: "제주", active: false },
  { id: "gangwon", name: "강원", active: false },
];

// 템플스테이 목록 가져오기
export async function getTempleStayList(sortBy: TempleStaySort = 'popular'): Promise<TempleStay[]> {
  try {
    let query = supabase.from('temple_stays').select('*');
    
    if (sortBy === 'popular') {
      query = query.order('follower_count', { ascending: false });
    } else if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching temple stays:', error);
      return [];
    }
    
    let templeStays = data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      description: item.description,
      duration: "1박 2일",
      websiteUrl: item.reservation_link,
      likeCount: item.follower_count || 0,
      direction: item.public_transportation || "대중교통 이용 가능",
      tags: ["휴식", "명상", "자연"],
      schedule: [] // Add empty schedule array to match interface
    }));
    
    // Sort by distance if needed
    if (sortBy === 'distance') {
      // Here we would need to have lat/long for temple stays, which might not be in the current schema
      // For now, we'll simulate by using temple location or a random distance
      templeStays = templeStays.map(stay => {
        // Calculate a simulated distance based on location string matching
        const simulatedDistance = stay.location?.includes('서울') ? 
          Math.random() * 10 : Math.random() * 100 + 10;
        return {
          ...stay,
          distance: formatDistance(simulatedDistance)
        };
      }).sort((a, b) => {
        const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '100000');
        const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '100000');
        return distA - distB;
      });
    }
    
    return templeStays;
  } catch (error) {
    console.error('Error in getTempleStayList:', error);
    return [];
  }
}

// 템플스테이 상세 정보 가져오기
export async function getTempleStayDetail(id: string): Promise<TempleStay | null> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*, timelines(*)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching temple stay details:', error);
      return null;
    }
    
    // Schedule from timelines
    const schedule = data.timelines ? 
      data.timelines.map((timeline: any) => ({
        time: timeline.time,
        activity: timeline.content
      })) : [];
    
    return {
      id: data.id,
      templeName: data.name,
      location: data.region,
      imageUrl: data.image_url,
      price: parseInt(data.cost_adult) || 50000,
      description: data.description,
      duration: `${data.start_date || '체크인'} ~ ${data.end_date || '체크아웃'}`,
      websiteUrl: data.reservation_link,
      likeCount: data.follower_count,
      direction: data.public_transportation,
      schedule: schedule,
      tags: ["휴식", "명상", "자연"]
    };
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    return null;
  }
}

// 지역별 템플스테이 가져오기
export async function getTempleStaysByRegion(region: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .ilike('region', `%${region}%`);
      
    if (error) {
      console.error('Error fetching temple stays by region:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url,
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation || "대중교통 이용 가능",
      schedule: []
    }));
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    return [];
  }
}

// 템플스테이 검색 기능
export async function searchTempleStays(query: string): Promise<TempleStay[]> {
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
      imageUrl: item.image_url,
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation || "대중교통 이용 가능",
      schedule: []
    }));
  } catch (error) {
    console.error('Error in searchTempleStays:', error);
    return [];
  }
}

// 태그별 템플스테이 필터링
export async function filterTempleStaysByTag(tag: string): Promise<TempleStay[]> {
  // 현재 태그 필드가 없으므로 임시로 지역으로 대체
  return getTempleStaysByRegion(tag);
}

// 템플스테이 팔로우 기능
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
    await supabase.rpc('increment_temple_stay_follower_count', { temple_stay_id: templeStayId });
    
    return true;
  } catch (error) {
    console.error('Error in followTempleStay:', error);
    return false;
  }
}

// 템플스테이 언팔로우 기능
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
    await supabase.rpc('decrement_temple_stay_follower_count', { temple_stay_id: templeStayId });
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTempleStay:', error);
    return false;
  }
}

// 사용자가 찜한 템플스테이 목록 가져오기
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
    
    return data.map(item => ({
      id: item.temple_stays.id,
      templeName: item.temple_stays.name,
      location: item.temple_stays.region,
      imageUrl: item.temple_stays.image_url,
      price: parseInt(item.temple_stays.cost_adult) || 50000,
      likeCount: item.temple_stays.follower_count,
      direction: item.temple_stays.public_transportation || "대중교통 이용 가능",
      schedule: []
    }));
  } catch (error) {
    console.error('Error in getUserFollowedTempleStays:', error);
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
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult) || 50000,
      likeCount: item.follower_count || 0,
      direction: item.public_transportation || "대중교통 이용 가능",
      schedule: []
    }));
  } catch (error) {
    console.error('Error in getTopLikedTempleStays:', error);
    return [];
  }
}

// 종합적인 순위로 정렬된 지역 가져오기
export async function getTopRegions(limit = 8): Promise<{name: string, count: number}[]> {
  try {
    // 이 함수는 지역별 템플스테이의 팔로워 수와 검색 수를 합산하여 인기 있는 지역을 반환
    const { data, error } = await supabase
      .from('temple_stays')
      .select('region, follower_count, search_count');
      
    if (error) {
      console.error('Error fetching temple stays for region ranking:', error);
      return [];
    }
    
    // 지역별로 데이터 집계
    const regionMap = new Map<string, {followers: number, searches: number}>();
    
    data.forEach(stay => {
      if (!stay.region) return;
      
      const region = stay.region.split(' ')[0]; // 첫 단어만 사용 (예: "서울특별시" -> "서울")
      const current = regionMap.get(region) || {followers: 0, searches: 0};
      
      regionMap.set(region, {
        followers: current.followers + (stay.follower_count || 0),
        searches: current.searches + (stay.search_count || 0)
      });
    });
    
    // 종합 점수 계산 및 정렬
    const regions = Array.from(regionMap.entries()).map(([name, stats]) => ({
      name,
      count: stats.followers + stats.searches
    }));
    
    return regions.sort((a, b) => b.count - a.count).slice(0, limit);
  } catch (error) {
    console.error('Error in getTopRegions:', error);
    return [];
  }
}
