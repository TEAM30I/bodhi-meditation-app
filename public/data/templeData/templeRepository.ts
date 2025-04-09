
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
  }
];

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
    contact: {
      phone: "055-934-3000"
    }
  }
};

export const nearbyTemples: Temple[] = [
  {
    id: "bulguksa",
    name: "불국사",
    location: "경주시",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bulguksa",
    distance: "3.5km"
  },
  {
    id: "haeinsa",
    name: "해인사",
    location: "합천군",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Haeinsa",
    distance: "15km"
  }
];

export const regionTags = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeongju", name: "경주", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "hapcheon", name: "합천", active: false },
  { id: "yangsan", name: "양산", active: false }
];

export function getTempleList(): Temple[] {
  return Object.values(temples);
}

export function getTopLikedTemples(limit = 5): Temple[] {
  return Object.values(temples).slice(0, limit);
}

export function filterTemplesByTag(tag: string): Temple[] {
  return Object.values(temples).filter(temple => temple.tags?.includes(tag));
}

export function searchTemples(query: string): Temple[] {
  if (!query) return [];
  const lowercaseQuery = query.toLowerCase();
  return Object.values(temples).filter(temple => 
    temple.name.toLowerCase().includes(lowercaseQuery) || 
    temple.location.toLowerCase().includes(lowercaseQuery)
  );
}
