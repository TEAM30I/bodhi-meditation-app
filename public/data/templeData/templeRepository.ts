// Temple Repository with Supabase Integration
import { supabase } from '../supabase_client';

// 기존 인터페이스 유지
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
}

// 뉴스 데이터는 현재 하드코딩된 상태 유지 (데이터베이스 테이블 없음)
export const newsData: NewsItem[] = [
  {
    id: "1",
    temple: "불국사",
    source: "불교신문",
    title: "불국사, 봄맞이 템플스테이 재개",
    link: "#",
    date: "2025-03-20"
  },
  {
    id: "2",
    temple: "해인사",
    source: "연합뉴스",
    title: "해인사 팔만대장경 전시회 개최",
    link: "#",
    date: "2025-03-18"
  },
  {
    id: "3",
    temple: "통도사",
    source: "불교방송",
    title: "통도사 봄 문화제 개최 예정",
    link: "#",
    date: "2025-03-15"
  },
  {
    id: "4",
    temple: "송광사",
    source: "문화일보",
    title: "송광사, 전통 산사음악회 5월 개최",
    link: "#",
    date: "2025-03-10"
  }
];

// 지역 태그 데이터
export const regionTags = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "hapcheon", name: "합천", active: false },
  { id: "yangsan", name: "양산", active: false },
  { id: "suncheon", name: "순천", active: false }
];

// nearbyTemples 데이터, 로직 업데이트 필요
export const nearbyTemples: Temple[] = [
  {
    id: "bulguksa",
    name: "불국사",
    location: "경주시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bulguksa",
    distance: "3.5km",
    likeCount: 4.8
  },
  {
    id: "haeinsa",
    name: "해인사",
    location: "합천군",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Haeinsa",
    distance: "15km",
    likeCount: 4.6
  },
  {
    id: "tongdosa",
    name: "통도사",
    location: "양산시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Tongdosa",
    distance: "8.2km",
    likeCount: 4.7
  },
  {
    id: "jogyesa",
    name: "조계사",
    location: "서울시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Jogyesa",
    distance: "1.2km",
    likeCount: 4.3
  }
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
      }
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
      likeCount: item.follower_count
    }));
  } catch (error) {
    console.error('Error in getTopLikedTemples:', error);
    return [];
  }
}

// 사찰 태그 기반 필터링 (태그 테이블이 있다고 가정)
export async function filterTemplesByTag(tag: string): Promise<Temple[]> {
  try {
    // 참고: 태그 테이블이 없다면 만들어야 함
    // 가상 구현 (실제로는 태그 테이블 필요)
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .textSearch('description', tag); // 임시로 설명에서 검색
      
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
      }
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
      }
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
    
    // 팔로워 카운트 업데이트 (RPC 함수가 있다고 가정)
    // 실제로는 트리거나 함수를 만들어야 할 수 있음
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
    
    // 팔로워 카운트 감소 (RPC 함수가 있다고 가정)
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
      likeCount: item.temples.follower_count
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
    
    // 반환할 사찰 객체 생성
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
      }
    };
  } catch (error) {
    console.error('Error in getTempleDetail:', error);
    return null;
  }
}

// 근처 사찰 가져오기 (좌표 기반 거리 계산 필요)
export async function getNearbyTemples(lat: number, lng: number, limit = 4): Promise<Temple[]> {
  try {
    // 위치 기반 검색을 위한 SQL 함수가 있다고 가정
    // Supabase에 해당 함수를 만들어야 함
    const { data, error } = await supabase.rpc('get_nearby_temples', { 
      lat, 
      lng, 
      max_distance: 20000, // 20km 내
      limit_count: limit
    });
    
    if (error) {
      console.error('Error fetching nearby temples:', error);
      return nearbyTemples; // 임시로 하드코딩 데이터 반환
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region,
      imageUrl: item.image_url,
      distance: `${(item.distance / 1000).toFixed(1)}km`,
      likeCount: item.follower_count
    }));
  } catch (error) {
    console.error('Error in getNearbyTemples:', error);
    return nearbyTemples; // 임시로 하드코딩 데이터 반환
  }
}