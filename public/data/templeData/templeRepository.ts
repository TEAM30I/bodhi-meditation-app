
// Temple repository data

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
  region: string; // Add this property to fix errors
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

export const temples: Record<string, Temple> = {
  "bulguksa": {
    id: "bulguksa",
    name: "불국사",
    location: "경주시",
    region: "경주",
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
    region: "합천",
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
    region: "양산",
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
    region: "순천",
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
    region: "서울",
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
    region: "서울",
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

export const nearbyTemples: Temple[] = [
  {
    id: "bulguksa",
    name: "불국사",
    location: "경주시",
    region: "경주",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bulguksa",
    distance: "3.5km",
    likeCount: 4.8
  },
  {
    id: "haeinsa",
    name: "해인사",
    location: "합천군",
    region: "합천",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Haeinsa",
    distance: "15km",
    likeCount: 4.6
  },
  {
    id: "tongdosa",
    name: "통도사",
    location: "양산시",
    region: "양산",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Tongdosa",
    distance: "8.2km",
    likeCount: 4.7
  },
  {
    id: "jogyesa",
    name: "조계사",
    location: "서울시",
    region: "서울",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Jogyesa",
    distance: "1.2km",
    likeCount: 4.3
  }
];

export const regions = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "hapcheon", name: "합천", active: false },
  { id: "yangsan", name: "양산", active: false },
  { id: "suncheon", name: "순천", active: false }
];

export const regionTags = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "hapcheon", name: "합천", active: false },
  { id: "yangsan", name: "양산", active: false },
  { id: "suncheon", name: "순천", active: false }
];

export function getTempleList(): Temple[] {
  return Object.values(temples);
}

export function getTopLikedTemples(limit = 5): Temple[] {
  return Object.values(temples)
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, limit);
}

export function filterTemplesByTag(tag: string): Temple[] {
  return Object.values(temples).filter(temple => temple.tags?.includes(tag));
}

export function searchTemples(query: string): Temple[] {
  if (!query) return [];
  const lowercaseQuery = query.toLowerCase();
  return Object.values(temples).filter(temple => 
    temple.name.toLowerCase().includes(lowercaseQuery) || 
    temple.location.toLowerCase().includes(lowercaseQuery) ||
    temple.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
