
// Temple data and utilities

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

// Example temple data
export const temples: Record<string, Temple> = {
  "bulguksa": {
    id: "bulguksa",
    name: "불국사",
    location: "경상북도 경주시",
    imageUrl: "https://images.unsplash.com/photo-1584633865778-6dbd4d9a4727?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 1250,
    description: "통일신라시대의 대표적인 사찰",
    openingHours: "09:00 - 18:00",
    tags: ["경주", "신라", "유네스코"],
    hasParkingLot: true,
    hasTempleStay: true,
    direction: "동쪽",
    websiteUrl: "https://www.bulguksa.or.kr",
    likeCount: 4850,
    facilities: ["주차장", "화장실", "매점"],
    contact: {
      phone: "054-746-9913"
    },
    social: {
      instagram: "@bulguksa_official"
    }
  },
  "haeinsa": {
    id: "haeinsa",
    name: "해인사",
    location: "경상남도 합천군",
    imageUrl: "https://images.unsplash.com/photo-1584634332100-3a8d2b8282e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 980,
    description: "팔만대장경을 보관하고 있는 사찰",
    openingHours: "08:30 - 18:00",
    tags: ["합천", "가야산", "유네스코"],
    hasParkingLot: true,
    hasTempleStay: true,
    direction: "남쪽",
    websiteUrl: "https://www.haeinsa.or.kr",
    likeCount: 3750,
    facilities: ["주차장", "화장실", "식당"],
    contact: {
      phone: "055-934-3000"
    }
  }
};

export const nearbyTemples: Temple[] = [
  {
    id: "tongdosa",
    name: "통도사",
    location: "경상남도 양산시",
    imageUrl: "https://images.unsplash.com/photo-1587080366538-6e454a81a33d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    distance: "12.5km",
    rating: 4.6,
    reviews: 850,
    tags: ["양산", "보물"]
  },
  {
    id: "songgwangsa",
    name: "송광사",
    location: "전라남도 순천시",
    imageUrl: "https://images.unsplash.com/photo-1576501296515-e285a09892ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    distance: "15.3km",
    rating: 4.5,
    reviews: 720,
    tags: ["순천", "승보사찰"]
  }
];

export const regionTags = [
  { id: "seoul", name: "서울", active: true },
  { id: "gyeonggi", name: "경기", active: false },
  { id: "gangwon", name: "강원", active: false },
  { id: "chungcheong", name: "충청", active: false },
  { id: "jeolla", name: "전라", active: false },
  { id: "gyeongsang", name: "경상", active: false },
  { id: "jeju", name: "제주", active: false }
];

export const newsData: NewsItem[] = [
  {
    id: "news-1",
    temple: "불국사",
    source: "불교신문",
    title: "불국사, 새벽 템플스테이 프로그램 확대",
    link: "https://example.com/news/1",
    date: "2025-04-05"
  },
  {
    id: "news-2",
    temple: "해인사",
    source: "연합뉴스",
    title: "해인사 팔만대장경 보존 특별 전시회 개최",
    link: "https://example.com/news/2",
    date: "2025-04-03"
  }
];

// Alias for backward compatibility
export const templeData = Object.values(temples);

export function getTempleList(): Temple[] {
  return Object.values(temples);
}

export function getTopLikedTemples(limit: number = 5): Temple[] {
  return Object.values(temples)
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, limit);
}

export function filterTemplesByTag(tag: string): Temple[] {
  return Object.values(temples).filter(temple => 
    temple.tags?.includes(tag)
  );
}

export function searchTemples(query: string): Temple[] {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return Object.values(temples).filter(temple => 
    temple.name.toLowerCase().includes(lowerQuery) || 
    temple.location.toLowerCase().includes(lowerQuery) ||
    temple.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
