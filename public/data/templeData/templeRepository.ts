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

// nearbyTemples 데이터 (추후 실제 거리 계산으로 대체 가능)
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

// 하드코딩된 temples 객체 (기존 코드와의 호환성 유지)
export const temples: Record<string, Temple> = {
  "bulguksa": {
    id: "bulguksa",
    name: "불국사",
    location: "경주시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bulguksa",
    description: "불국사는 경상북도 경주시 불국로에 있는 대한불교 조계종 제11교구 본사 직영 사찰이다.",
    direction: "경주시 불국로 385",
    websiteUrl: "https://www.bulguksa.or.kr",
    tags: ["전통사찰", "유네스코", "경주"],
    facilities: ["주차장", "화장실", "매점"],
    openingHours: "07:00 - 17:00",
    likeCount: 4.8,
    contact: {
      phone: "054-746-9913"
    }
  },
  "haeinsa": {
    id: "haeinsa",
    name: "해인사",
    location: "합천군",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Haeinsa",
    description: "해인사는 경상남도 합천군 가야면 해인사길에 있는 대한불교 조계종 제12교구 본사이다.",
    direction: "합천군 가야면 해인사길 122",
    websiteUrl: "https://www.haeinsa.or.kr",
    tags: ["전통사찰", "유네스코", "팔만대장경"],
    facilities: ["주차장", "화장실", "식당"],
    openingHours: "08:00 - 18:00",
    likeCount: 4.6,
    contact: {
      phone: "055-934-3000"
    }
  },
  "tongdosa": {
    id: "tongdosa",
    name: "통도사",
    location: "양산시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Tongdosa",
    description: "통도사는 경상남도 양산시 하북면에 있는 대한불교 조계종 제16교구 본사이다.",
    direction: "양산시 하북면 통도사로 108",
    websiteUrl: "https://www.tongdosa.or.kr",
    tags: ["전통사찰", "불보종찰", "양산"],
    facilities: ["주차장", "화장실", "식당", "기념품점"],
    openingHours: "08:30 - 18:00",
    likeCount: 4.7,
    contact: {
      phone: "055-382-7182"
    }
  },
  "songgwangsa": {
    id: "songgwangsa",
    name: "송광사",
    location: "순천시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Songgwangsa",
    description: "송광사는 전라남도 순천시 송광면에 있는 대한불교 조계종 제21교구 본사이다.",
    direction: "순천시 송광면 송광사길 100",
    websiteUrl: "https://www.songgwangsa.org",
    tags: ["전통사찰", "승보종찰", "순천"],
    facilities: ["주차장", "화장실", "식당"],
    openingHours: "08:00 - 18:00",
    likeCount: 4.5,
    contact: {
      phone: "061-755-0107"
    }
  },
  "jogyesa": {
    id: "jogyesa",
    name: "조계사",
    location: "서울시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Jogyesa",
    description: "조계사는 서울특별시 종로구 우정국로에 있는 대한불교 조계종 본사이다.",
    direction: "서울시 종로구 우정국로 55",
    websiteUrl: "https://www.jogyesa.kr",
    tags: ["도심사찰", "서울", "종로"],
    facilities: ["주차장", "화장실", "법당"],
    openingHours: "24시간",
    likeCount: 4.3,
    contact: {
      phone: "02-768-8600"
    }
  },
  "bongeunsa": {
    id: "bongeunsa",
    name: "봉은사",
    location: "서울시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bongeunsa",
    description: "봉은사는 서울특별시 강남구 삼성동에 있는 대한불교 조계종 사찰이다.",
    direction: "서울시 강남구 봉은사로 531",
    websiteUrl: "https://www.bongeunsa.org",
    tags: ["도심사찰", "서울", "강남"],
    facilities: ["주차장", "화장실", "법당", "템플스테이"],
    openingHours: "04:00 - 20:00",
    likeCount: 4.2,
    contact: {
      phone: "02-3218-4800"
    }
  }
};

// Supabase 데이터베이스에서 사찰 목록 가져오기
export async function getTempleList(): Promise<Temple[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*');
      
    if (error) {
      console.error('Error fetching temples:', error);
      return Object.values(temples); // 오류 시 하드코딩 데이터 반환
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
    return Object.values(temples); // 오류 시 하드코딩 데이터 반환
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
      // 오류 시 하드코딩 데이터 반환
      return Object.values(temples)
        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, limit);
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
    // 오류 시 하드코딩 데이터 반환
    return Object.values(temples)
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .slice(0, limit);
  }
}

// 사찰 태그 기반 필터링 (설명 필드 활용)
export async function filterTemplesByTag(tag: string): Promise<Temple[]> {
  try {
    // 참고: 태그 테이블이 없다면 만들어야 함
    // 임시로 description 필드에서 검색
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .ilike('description', `%${tag}%`);
      
    if (error) {
      console.error('Error filtering temples by tag:', error);
      // 오류 시 하드코딩 데이터에서 필터링
      return Object.values(temples).filter(temple => 
        temple.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
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
    // 오류 시 하드코딩 데이터에서 필터링
    return Object.values(temples).filter(temple => 
      temple.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
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
      // 오류 시 하드코딩 데이터에서 검색
      return Object.values(temples).filter(temple => 
        temple.name.toLowerCase().includes(query.toLowerCase()) ||
        temple.location.toLowerCase().includes(query.toLowerCase()) ||
        temple.description?.toLowerCase().includes(query.toLowerCase())
      );
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
    // 오류 시 하드코딩 데이터에서 검색
    return Object.values(temples).filter(temple => 
      temple.name.toLowerCase().includes(query.toLowerCase()) ||
      temple.location.toLowerCase().includes(query.toLowerCase()) ||
      temple.description?.toLowerCase().includes(query.toLowerCase())
    );
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
    
    // 팔로워 카운트 업데이트 (실제 구현 필요)
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
    
    // 팔로워 카운트 감소 (실제 구현 필요)
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

// 사찰 상세 정보 가져오기 (getTempleDetail 추가)
export async function getTempleDetail(id: string): Promise<Temple | null> {
  try {
    // Supabase에서 사찰 정보 가져오기
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching temple details:', error);
      // 하드코딩 데이터에서 찾기
      return temples[id] || null;
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
      },
      // 기타 필요한 속성 추가
      openingHours: data.opening_hours,
      tags: data.tags ? JSON.parse(data.tags) : [],
      facilities: data.facilities ? JSON.parse(data.facilities) : [],
      websiteUrl: data.website_url
    };
  } catch (error) {
    console.error('Error in getTempleDetail:', error);
    // 하드코딩 데이터에서 찾기
    return temples[id] || null;
  }
}

// 근처 사찰 가져오기 (좌표 기반 거리 계산 필요)
export async function getNearbyTemples(lat: number, lng: number, limit = 4): Promise<Temple[]> {
  try {
    // 위치 기반 검색 (PostgreSQL 함수 필요)
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