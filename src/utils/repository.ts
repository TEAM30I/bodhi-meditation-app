
// Repository exports with consistent static imports
import { supabase } from '../data/supabase_client';

// Export types from searchRankingRepository
export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

// Search Rankings functions
export async function getRegionSearchRankings(): Promise<SearchRanking[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_region_search_rankings')
      .limit(10);
      
    if (error) {
      console.error('Error fetching region search rankings:', error);
      return []; 
    }
    
    // 트렌드 정보를 가져옴
    const { data: trendsData, error: trendsError } = await supabase
      .from('search_trends')
      .select('term, trend')
      .eq('category', 'region');
      
    if (trendsError) {
      console.error('Error fetching region search trends:', trendsError);
    }
    
    // 트렌드 정보와 결합
    const result = data.map((item: any, index: number) => ({
      id: `r${index + 1}`,
      term: item.term,
      count: parseInt(item.count),
      trend: (trendsData?.find(t => t.term === item.term)?.trend as 'up' | 'down' | 'new' | 'same') || 'same'
    }));
    
    return result;
  } catch (error) {
    console.error('Error in getRegionSearchRankings:', error);
    return [];
  }
}

export async function getTempleStaySearchRankings(): Promise<SearchRanking[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_temple_stay_search_rankings')
      .limit(10);
      
    if (error) {
      console.error('Error fetching temple stay search rankings:', error);
      return [];
    }
    
    // 트렌드 정보를 가져옴
    const { data: trendsData, error: trendsError } = await supabase
      .from('search_trends')
      .select('term, trend')
      .eq('category', 'temple_stay');
      
    if (trendsError) {
      console.error('Error fetching temple stay search trends:', trendsError);
    }
    
    // 트렌드 정보와 결합
    const result = data.map((item: any, index: number) => ({
      id: `ts${index + 1}`,
      term: item.term,
      count: parseInt(item.count),
      trend: (trendsData?.find(t => t.term === item.term)?.trend as 'up' | 'down' | 'new' | 'same') || 'same'
    }));
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStaySearchRankings:', error);
    return [];
  }
}

export async function addSearchTerm(term: string, category: 'region' | 'temple_stay'): Promise<boolean> {
  try {
    // 검색 히스토리에 레코드 추가
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: getCurrentUserId(), // 현재 사용자 ID 얻는 함수
        term: term.toLowerCase().trim(), // 소문자 변환 및 공백 제거
        category: category,
        searched_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error recording search term:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addSearchTerm:', error);
    return false;
  }
}

function getCurrentUserId(): string {
  // 사용자 세션에서 ID 가져오기 시도
  try {
    const session = supabase.auth.getSession();
    // @ts-ignore - 비동기 함수이므로 실제 구현에서는 async/await 사용해야 함
    return session?.data?.session?.user?.id || 'anonymous';
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return 'anonymous';
  }
}

// Export from templeStayRepository
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

// Export Temple types
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

// Export locations function
export async function getLocations(): Promise<{ name: string; active: boolean }[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('name')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Error fetching locations:', error);
      return [
        { name: '서울', active: true },
        { name: '경주', active: false },
        { name: '부산', active: false }
      ];
    }
    
    return data.map(location => ({
      name: location.name,
      active: false
    }));
  } catch (error) {
    console.error('Error in getLocations:', error);
    return [
      { name: '서울', active: true },
      { name: '경주', active: false },
      { name: '부산', active: false }
    ];
  }
}

// Export Temple list functions
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

// Export Temple Stay list functions
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

// Export templeStayRepository functions
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

// Follow/unfollow temple stay functions
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

// Export Temple functions
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
