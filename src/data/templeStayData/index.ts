
// Temple Stay Data Index - consolidate all temple stay data here
import { TempleStay } from './types';

// Create templeStay data directly here to resolve import issues
export const templeStays: Record<string, TempleStay> = {
  "ts001": {
    id: "ts001",
    templeName: "불국사 템플스테이",
    location: "경북 경주시 불국로 385",
    description: "천년 고찰에서 경험하는 전통 불교 생활",
    price: 50000,
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 120,
    tags: ["명상", "좌선", "사찰음식체험"]
  },
  "ts002": {
    id: "ts002",
    templeName: "해인사 템플스테이",
    location: "경남 합천군 가야면 해인사길 122",
    description: "팔만대장경의 고장에서 체험하는 불교 생활",
    price: 65000,
    duration: "2박 3일",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 95,
    tags: ["사경", "발우공양", "참선"]
  },
  "ts003": {
    id: "ts003",
    templeName: "통도사 템플스테이",
    location: "경남 양산시 하북면 통도사로 108",
    description: "불보사찰에서 체험하는 고요한 수행",
    price: 55000,
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 87,
    tags: ["명상", "발우공양", "영취산 산책"]
  },
  "ts004": {
    id: "ts004",
    templeName: "봉선사 템플스테이",
    location: "서울 성북구 봉선사길 28",
    description: "도심 속에서 만나는 평화로운 휴식",
    price: 45000,
    duration: "당일 체험",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 103,
    tags: ["도심템플스테이", "명상", "차담"]
  },
  "ts005": {
    id: "ts005",
    templeName: "송광사 템플스테이",
    location: "전남 순천시 송광면 송광사안길 100",
    description: "승보사찰의 전통을 체험하는 시간",
    price: 60000,
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 77,
    tags: ["참선", "스님과의 대화", "발우공양"]
  }
};

// Common temple stay locations
export const locations = [
  "서울",
  "경주",
  "부산",
  "양산",
  "합천",
  "순천",
  "제주"
];

// Function to get temple stay by ID
export const getTempleStayById = (id: string): TempleStay | undefined => {
  return templeStays[id];
};

// Get all temple stays as an array
export const getTempleStayList = (): TempleStay[] => {
  return Object.values(templeStays);
};

// Get top liked temple stays
export const getTopLikedTempleStays = (limit: number = 5): TempleStay[] => {
  return getTempleStayList()
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
};

// Search temple stays by search query
export const searchTempleStays = (query: string): TempleStay[] => {
  const lowercaseQuery = query.toLowerCase();
  return getTempleStayList().filter(ts => 
    ts.templeName.toLowerCase().includes(lowercaseQuery) || 
    ts.location.toLowerCase().includes(lowercaseQuery) || 
    ts.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Filter temple stays by tag
export const filterTempleStaysByTag = (tag: string): TempleStay[] => {
  return getTempleStayList().filter(ts => 
    ts.tags && ts.tags.includes(tag)
  );
};

// Export the TempleStay type
export type { TempleStay } from './types';
