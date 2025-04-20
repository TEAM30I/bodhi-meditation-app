// Temple Stay Repository with Supabase Integration
import { supabase } from '../supabase_client'

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

// 하드코딩된 templeStays (호환성 유지)
export const templeStays: Record<string, TempleStay> = {
  "ts-bulguksa": {
    id: "ts-bulguksa",
    templeName: "불국사 템플스테이",
    location: "경주시",
    direction: "경주시 불국로 385",
    price: 50000,
    likeCount: 482,
    description: "불국사에서 진행하는, 참선을 주제로 한 당일형 템플스테이입니다.",
    duration: "1박 2일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bulguksa+Stay",
    websiteUrl: "https://www.bulguksa.or.kr/templestay",
    schedule: [
      { time: "17:00", activity: "입소 및 오리엔테이션" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "저녁 예불 및 참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "06:00", activity: "참선" },
      { time: "07:00", activity: "아침 공양" },
      { time: "09:00", activity: "퇴소" }
    ],
    tags: ["참선", "명상", "당일형"]
  },
  "ts-haeinsa": {
    id: "ts-haeinsa",
    templeName: "해인사 템플스테이",
    location: "합천군",
    direction: "합천군 가야면 해인사길 122",
    price: 70000,
    likeCount: 361,
    description: "팔만대장경의 본사인 해인사에서 진행하는 1박 2일 템플스테이입니다.",
    duration: "1박 2일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Haeinsa+Stay",
    websiteUrl: "https://www.haeinsa.or.kr/templestay",
    schedule: [
      { time: "15:00", activity: "입소 및 오리엔테이션" },
      { time: "16:00", activity: "사찰 투어" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "저녁 예불 및 참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "06:00", activity: "참선" },
      { time: "07:00", activity: "아침 공양" },
      { time: "08:00", activity: "108배" },
      { time: "09:00", activity: "퇴소" }
    ],
    tags: ["108배", "사찰투어", "팔만대장경"]
  },
  "ts-tongdosa": {
    id: "ts-tongdosa",
    templeName: "통도사 템플스테이",
    location: "양산시",
    direction: "양산시 하북면 통도사로 108",
    price: 60000,
    likeCount: 295,
    description: "통도사에서 진행하는 1박 2일 템플스테이입니다. 불보종찰 통도사에서 수행자의 삶을 체험해보세요.",
    duration: "1박 2일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Tongdosa+Stay",
    websiteUrl: "https://www.tongdosa.or.kr/templestay",
    schedule: [
      { time: "14:00", activity: "입소 및 오리엔테이션" },
      { time: "15:00", activity: "사찰 예절 및 불교 강좌" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "07:00", activity: "아침 공양" },
      { time: "08:00", activity: "사찰 탐방" },
      { time: "11:00", activity: "퇴소" }
    ],
    tags: ["참선", "불교 강좌", "사찰 탐방"]
  },
  "ts-jogyesa": {
    id: "ts-jogyesa",
    templeName: "조계사 템플스테이",
    location: "서울시",
    direction: "서울시 종로구 우정국로 55",
    price: 40000,
    likeCount: 180,
    description: "도심 속 사찰인 조계사에서 진행하는 당일형 템플스테이로, 바쁜 일상 속에서 잠시 휴식을 취해보세요.",
    duration: "당일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Jogyesa+Stay",
    websiteUrl: "https://www.jogyesa.kr/templestay",
    schedule: [
      { time: "09:00", activity: "입소 및 오리엔테이션" },
      { time: "10:00", activity: "명상 체험" },
      { time: "12:00", activity: "점심 공양" },
      { time: "13:30", activity: "108배" },
      { time: "15:00", activity: "차담" },
      { time: "16:30", activity: "소감 나누기" },
      { time: "17:00", activity: "퇴소" }
    ],
    tags: ["도심 템플스테이", "당일형", "명상"]
  },
  "ts-bongeunsa": {
    id: "ts-bongeunsa",
    templeName: "봉은사 템플스테이",
    location: "서울시",
    direction: "서울시 강남구 봉은사로 531",
    price: 45000,
    likeCount: 210,
    description: "서울 강남 한복판에 위치한 봉은사에서 진행하는, 명상과 힐링에 초점을 맞춘 템플스테이입니다.",
    duration: "당일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bongeunsa+Stay",
    websiteUrl: "https://www.bongeunsa.org/templestay",
    schedule: [
      { time: "13:00", activity: "입소 및 오리엔테이션" },
      { time: "14:00", activity: "사찰 탐방" },
      { time: "15:30", activity: "차담 및 명상" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "연등 만들기" },
      { time: "21:00", activity: "퇴소" }
    ],
    tags: ["도심 템플스테이", "당일형", "연등 만들기"]
  },
  "ts-songgwangsa": {
    id: "ts-songgwangsa",
    templeName: "송광사 템플스테이",
    location: "순천시",
    direction: "순천시 송광면 송광사길 100",
    price: 65000,
    likeCount: 320,
    description: "승보종찰 송광사에서 진행하는 2박 3일 템플스테이로, 깊은 산속에서 수행자의 삶을 경험해보세요.",
    duration: "2박 3일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Songgwangsa+Stay",
    websiteUrl: "https://www.songgwangsa.org/templestay",
    schedule: [
      { time: "14:00", activity: "입소 및 오리엔테이션" },
      { time: "15:00", activity: "사찰 예절 및 불교 강좌" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "07:00", activity: "아침 공양" },
      { time: "09:00", activity: "108배" },
      { time: "12:00", activity: "점심 공양" },
      { time: "14:00", activity: "산책 및 명상" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "21:00", activity: "취침" },
      { time: "09:00", activity: "퇴소" }
    ],
    tags: ["산사체험", "장기형", "명상"]
  }
};

// 템플스테이 목록 가져오기
export async function getTempleStayList(): Promise<TempleStay[]> {
  try {
    // temple_stays 테이블에서 데이터 가져오기
    const { data: templeStayData, error: templeStayError } = await supabase
      .from('temple_stays')
      .select('*');
      
    if (templeStayError) {
      console.error('Error fetching temple stays:', templeStayError);
      return Object.values(templeStays); // 오류 시 하드코딩 데이터 반환
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
        tags: stay.tags ? JSON.parse(stay.tags) : []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStayList:', error);
    return Object.values(templeStays); // 오류 시 하드코딩 데이터 반환
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
      // 하드코딩 데이터에서 정렬하여 반환
      return Object.values(templeStays)
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, limit);
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
        tags: stay.tags ? JSON.parse(stay.tags) : []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTopLikedTempleStays:', error);
    // 하드코딩 데이터에서 정렬하여 반환
    return Object.values(templeStays)
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, limit);
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
      // 하드코딩 데이터에서 검색
      return Object.values(templeStays).filter(ts => 
        ts.templeName.toLowerCase().includes(query.toLowerCase()) ||
        ts.location.toLowerCase().includes(query.toLowerCase()) ||
        ts.description.toLowerCase().includes(query.toLowerCase())
      );
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
        tags: stay.tags ? JSON.parse(stay.tags) : []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in searchTempleStays:', error);
    // 하드코딩 데이터에서 검색
    return Object.values(templeStays).filter(ts => 
      ts.templeName.toLowerCase().includes(query.toLowerCase()) ||
      ts.location.toLowerCase().includes(query.toLowerCase()) ||
      ts.description.toLowerCase().includes(query.toLowerCase())
    );
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
      .ilike('description', `%${tag}%`);
      
    if (error) {
      console.error('Error filtering temple stays by tag:', error);
      // 하드코딩 데이터에서 필터링
      return Object.values(templeStays).filter(ts => 
        ts.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
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
        tags: stay.tags ? JSON.parse(stay.tags) : []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in filterTempleStaysByTag:', error);
    // 하드코딩 데이터에서 필터링
    return Object.values(templeStays).filter(ts => 
      ts.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
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
    
    // 팔로워 카운트 업데이트 (실제 구현 필요)
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
    
    // 팔로워 카운트 감소 (실제 구현 필요)
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
        tags: stay.tags ? JSON.parse(stay.tags) : []
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
      // 오류 시 하드코딩 데이터에서 찾기
      return templeStays[id] || null;
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
        tags: stayData.tags ? JSON.parse(stayData.tags) : []
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
      tags: stayData.tags ? JSON.parse(stayData.tags) : []
    };
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    // 오류 시 하드코딩 데이터에서 찾기
    return templeStays[id] || null;
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
      // 하드코딩 데이터에서 필터링
      return Object.values(templeStays).filter(ts => 
        ts.location.toLowerCase().includes(region.toLowerCase())
      );
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
        tags: stay.tags ? JSON.parse(stay.tags) : []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    // 하드코딩 데이터에서 필터링
    return Object.values(templeStays).filter(ts => 
      ts.location.toLowerCase().includes(region.toLowerCase())
    );
  }
}