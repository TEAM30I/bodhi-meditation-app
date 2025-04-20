// Temple Stay Repository with Supabase Integration
import { supabase } from '../supabase_client';

// 기존 인터페이스 유지
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
}

// 지역 데이터
export const locations = [
  { name: "서울", active: true },
  { name: "경주", active: false },
  { name: "부산", active: false },
  { name: "합천", active: false },
  { name: "양산", active: false },
  { name: "여수", active: false },
  { name: "순천", active: false }
];

// 템플스테이 목록 가져오기
export async function getTempleStayList(): Promise<TempleStay[]> {
  try {
    // temple_stays 테이블에서 데이터 가져오기
    const { data: templeStayData, error: templeStayError } = await supabase
      .from('temple_stays')
      .select('*, temple:temples(name, region)');
      
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
        tags: [] // 필요하다면 별도 테이블 생성 필요
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
        tags: []
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
        tags: []
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
    // 태그 테이블이 없다면 만들어야 함
    // 임시로 description에서 검색
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .textSearch('description', tag);
      
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
        tags: []
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
    
    // 팔로워 카운트 업데이트 (RPC 함수가 있다고 가정)
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
    
    // 팔로워 카운트 감소 (RPC 함수가 있다고 가정)
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
        tags: []
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
      return null;
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
      tags: []
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
        tags: []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    return [];
  }
}