
import { supabase } from '../supabase_client';

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
}

// Locations for filtering
export const locations = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "jeju", name: "제주", active: false },
  { id: "gangwon", name: "강원", active: false },
];

// 템플스테이 목록 가져오기
export async function getTempleStayList(): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*');
      
    if (error) {
      console.error('Error fetching temple stays:', error);
      return [];
    }
    
    return data.map(item => ({
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
      tags: ["휴식", "명상", "자연"]
    }));
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
      likeCount: item.follower_count
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
      likeCount: item.follower_count
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
      likeCount: item.temple_stays.follower_count
    }));
  } catch (error) {
    console.error('Error in getUserFollowedTempleStays:', error);
    return [];
  }
}
