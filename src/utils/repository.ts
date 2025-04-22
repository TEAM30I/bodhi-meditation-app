
// Repository file with types and functions for temple and temple stay data
import { searchTemplesDirectly, searchTempleStaysDirectly } from '@/integrations/supabase/client';

// Type definitions
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

export interface NewsItem {
  id: string;
  temple: string;
  source: string;
  title: string;
  link: string;
  date: string;
}

export interface Scripture {
  id: string;
  title: string;
  categories: string[];
  colorScheme: ScriptureColorScheme;
  content: string;
  chapters: ScriptureChapter[];
  progress?: number;
  hasStarted?: boolean;
  lastReadChapter?: string;
  lastPageIndex?: number;
}

export interface ScriptureChapter {
  id: string;
  title: string;
  original: string;
  explanation: string;
}

export interface Bookmark {
  id: string;
  scriptureId: string;
  chapterId: string;
  pageIndex: number;
  title: string;
  note?: string;
  date: string;
}

export interface ReadingProgress {
  scriptureId: string;
  chapterId: string;
  pageIndex: number;
  progress: number;
}

export interface ScriptureColorScheme {
  bg: string;
  text: string;
  progressBg: string;
}

export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

// Static data
export const regionTags = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "hapcheon", name: "합천", active: false },
  { id: "yangsan", name: "양산", active: false },
  { id: "suncheon", name: "순천", active: false }
];

export const scriptures: Record<string, Scripture> = {};
export const scriptureCategories = [];
export const readingSchedule = [];
export const bookmarks: Bookmark[] = [];
export const calendarData = [];

// Temple related functions - these will be implemented with direct Supabase calls
// For now they return empty arrays or placeholders to prevent errors
export const getTempleList = async (): Promise<Temple[]> => {
  console.log('getTempleList called - implement with direct Supabase call');
  return [];
};

export const getTempleDetail = async (id: string): Promise<Temple | null> => {
  console.log(`getTempleDetail called for id: ${id} - implement with direct Supabase call`);
  return null;
};

// Updated search function to use direct Supabase connection
export const searchTemples = async (query: string): Promise<Temple[]> => {
  try {
    if (!query.trim()) return [];
    
    const { data, error } = await searchTemplesDirectly(query);
    if (error) {
      console.error('Error searching temples:', error);
      return [];
    }
    return data as Temple[];
  } catch (error) {
    console.error('Exception searching temples:', error);
    return [];
  }
};

export const filterTemplesByTag = async (tag: string): Promise<Temple[]> => {
  console.log(`filterTemplesByTag called for tag: ${tag} - implement with direct Supabase call`);
  return [];
};

export const followTemple = async (userId: string, templeId: string): Promise<boolean> => {
  console.log(`followTemple called for userId: ${userId}, templeId: ${templeId} - implement with direct Supabase call`);
  return true;
};

export const unfollowTemple = async (userId: string, templeId: string): Promise<boolean> => {
  console.log(`unfollowTemple called for userId: ${userId}, templeId: ${templeId} - implement with direct Supabase call`);
  return true;
};

// New temple functions to address errors
export const getTopLikedTemples = async (limit: number = 5): Promise<Temple[]> => {
  console.log(`getTopLikedTemples called with limit: ${limit} - implement with direct Supabase call`);
  return [];
};

export const getNearbyTemples = async (lat: number, lng: number, limit: number = 5): Promise<Temple[]> => {
  console.log(`getNearbyTemples called with lat: ${lat}, lng: ${lng}, limit: ${limit} - implement with direct Supabase call`);
  return [];
};

// Temple Stay related functions
export const getTempleStayList = async (): Promise<TempleStay[]> => {
  console.log('getTempleStayList called - implement with direct Supabase call');
  return [];
};

export const getTempleStayDetail = async (id: string): Promise<TempleStay | null> => {
  console.log(`getTempleStayDetail called for id: ${id} - implement with direct Supabase call`);
  return null;
};

// Updated search function for temple stays
export const searchTempleStays = async (query: string): Promise<TempleStay[]> => {
  try {
    if (!query.trim()) return [];
    
    const { data, error } = await searchTempleStaysDirectly(query);
    if (error) {
      console.error('Error searching temple stays:', error);
      return [];
    }
    return data as TempleStay[];
  } catch (error) {
    console.error('Exception searching temple stays:', error);
    return [];
  }
};

export const filterTempleStaysByTag = async (tag: string): Promise<TempleStay[]> => {
  console.log(`filterTempleStaysByTag called for tag: ${tag} - implement with direct Supabase call`);
  return [];
};

export const followTempleStay = async (userId: string, templeStayId: string): Promise<boolean> => {
  console.log(`followTempleStay called for userId: ${userId}, templeStayId: ${templeStayId} - implement with direct Supabase call`);
  return true;
};

export const unfollowTempleStay = async (userId: string, templeStayId: string): Promise<boolean> => {
  console.log(`unfollowTempleStay called for userId: ${userId}, templeStayId: ${templeStayId} - implement with direct Supabase call`);
  return true;
};

// New temple stay functions to address errors
export const getLocations = async (): Promise<{name: string; active: boolean}[]> => {
  console.log('getLocations called - implement with direct Supabase call');
  return [
    { name: '서울', active: true },
    { name: '경주', active: false },
    { name: '부산', active: false }
  ];
};

export const getTopLikedTempleStays = async (limit: number = 5): Promise<TempleStay[]> => {
  console.log(`getTopLikedTempleStays called with limit: ${limit} - implement with direct Supabase call`);
  return [];
};

export const getTempleStaysByRegion = async (region: string): Promise<TempleStay[]> => {
  console.log(`getTempleStaysByRegion called for region: ${region} - implement with direct Supabase call`);
  return [];
};

// 임시 검색 순위 데이터 (실제 데이터베이스 함수 구현 전까지 사용)
const tempRegionSearchRankings: SearchRanking[] = [
  { id: "1", term: '서울', count: 120, trend: 'same' },
  { id: "2", term: '부산', count: 95, trend: 'up' },
  { id: "3", term: '경주', count: 88, trend: 'down' },
  { id: "4", term: '강원도', count: 76, trend: 'same' },
  { id: "5", term: '전주', count: 62, trend: 'new' },
];

const tempTempleStaySearchRankings: SearchRanking[] = [
  { id: "1", term: '템플라이프', count: 85, trend: 'up' },
  { id: "2", term: '휴식형', count: 72, trend: 'same' },
  { id: "3", term: '명상', count: 65, trend: 'down' },
  { id: "4", term: '체험형', count: 54, trend: 'new' },
  { id: "5", term: '당일형', count: 47, trend: 'same' },
];

// 검색 순위 관련 함수들 (임시 데이터 반환)
export const getRegionSearchRankings = async (): Promise<SearchRanking[]> => {
  try {
    // 이후 실제 Supabase 함수 구현 시 여기를 수정
    return tempRegionSearchRankings;
  } catch (error) {
    console.error('Error fetching region search rankings:', error);
    return [];
  }
};

export const getTempleStaySearchRankings = async (): Promise<SearchRanking[]> => {
  try {
    // 이후 실제 Supabase 함수 구현 시 여기를 수정
    return tempTempleStaySearchRankings;
  } catch (error) {
    console.error('Error fetching temple stay search rankings:', error);
    return [];
  }
};

// 검색어 추가 함수 (임시 로직)
export const addSearchTerm = async (
  term: string,
  type: 'region' | 'temple_stay'
): Promise<void> => {
  try {
    // 이후 실제 Supabase 함수 구현 시 여기를 수정
    console.log(`Added search term: ${term} (${type})`);
  } catch (error) {
    console.error('Error recording search term:', error);
  }
};

// Scripture related functions
export const getScriptureById = (id: string): Scripture | undefined => {
  console.log(`getScriptureById called for id: ${id}`);
  return undefined;
};

export const updateReadingProgress = (
  scriptureId: string, 
  progress: number, 
  chapterId: string, 
  pageIndex: number
): void => {
  console.log(`updateReadingProgress called for scriptureId: ${scriptureId}`);
};

export const addBookmark = (
  userId: string, 
  scriptureId: string, 
  chapterId: string, 
  pageIndex: number, 
  title: string
): Bookmark => {
  console.log(`addBookmark called for scriptureId: ${scriptureId}`);
  return {
    id: 'temp-id',
    scriptureId,
    chapterId,
    pageIndex,
    title,
    date: new Date().toISOString()
  };
};
