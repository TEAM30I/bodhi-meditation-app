/* ------------------------------------------------------------------
 * 1. 공통 인터페이스
 * ------------------------------------------------------------------ */
export interface NewsItem {
  id: string;
  temple: string;
  source: string;
  title: string;
  link: string;
  date: string;
}

/** 세 가지 Temple 정의를 모두 포괄하도록 통합 */
export interface Temple {
  /* 필수 */
  id: string;
  name: string;
  location: string;
  imageUrl: string;

  /* 선택 ─ 원본 정의에 존재했던 모든 필드 */
  distance?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  openingHours?: string;
  tags?: string[];
  hasParkingLot?: boolean;
  hasTempleStay?: boolean;
  /* ↓ 두 번째 Temple 정의에만 있던 필드 */
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

/* ------------------------------------------------------------------
 * 2. 원본 데이터 그대로 선언
 * ------------------------------------------------------------------ */
// 2‑1) 뉴스
export const newsData: NewsItem[] = [
  {
    id: "news1",
    temple: "조계사",
    source: "불교신문",
    title: "부처님오신날 특별 법회 일정 안내",
    link: "/news/1",
    date: "2025-04-02"
  },
  {
    id: "news2",
    temple: "봉은사",
    source: "연합뉴스",
    title: "전통 사찰 문화 체험 행사 개최",
    link: "/news/2",
    date: "2025-04-01"
  },
  {
    id: "news3",
    temple: "미륵사",
    source: "유튜브",
    title: "천년 고찰의 비밀, 미륵사의 유래",
    link: "/news/3",
    date: "2025-03-31"
  },
  {
    id: "news4",
    temple: "송광사",
    source: "송광사 - 네이버 블로그",
    title: "힐링이 필요할 땐, 송광사 템플스테이 후기",
    link: "/news/4",
    date: "2025-03-30"
  },
  {
    id: "news5",
    temple: "통도사",
    source: "통도사 - 인스타그램",
    title: "오늘의 풍경, 봄꽃이 만개한 사찰의 모습",
    link: "/news/5",
    date: "2025-03-29"
  }
];

// 2‑2) 주변 사찰
export const nearbyTemples: Temple[] = [
  {
    id: "bulguksa-nearby",
    name: "불국사",
    location: "경북 경주시",
    distance: "도보 10분",
    imageUrl:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "haeinsa-nearby",
    name: "해인사",
    location: "경남 합천군",
    distance: "도보 10분",
    imageUrl:
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

// 2‑3) 인기 사찰
export const popularTemples: Temple[] = [
  {
    id: "temple1",
    name: "불국사 템플스테이",
    location: "경북 경주시",
    rating: 4.5,
    reviews: 22,
    tags: ["전통", "문화재"],
    imageUrl:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "temple2",
    name: "봉선사 템플스테이",
    location: "서울 성북구",
    rating: 4.5,
    reviews: 18,
    tags: ["도심", "명상"],
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "temple3",
    name: "통도사",
    location: "경남 양산시",
    rating: 4.8,
    reviews: 32,
    tags: ["불이문", "성보박물관"],
    imageUrl:
      "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "temple4",
    name: "월정사",
    location: "강원 평창군",
    rating: 4.7,
    reviews: 27,
    tags: ["전나무숲", "팔각구층석탑"],
    imageUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

// 2‑4) 주요 사찰(Record 형태)
export const temples: Record<string, Temple> = {
  불국사: {
    id: "bulguksa",
    name: "불국사",
    location: "경북 경주시 불국로 385",
    direction: "경주역에서 버스 10번, 11번 이용 약 20분",
    description: "천년의 역사를 간직한 고찰",
    openingHours: "08:00 ~ 18:00",
    websiteUrl: "https://www.bulguksa.or.kr",
    imageUrl:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 1205,
    tags: ["문화재", "역사", "관광명소"],
    facilities: ["주차장", "화장실", "템플스테이"],
    contact: { phone: "054-746-9913" },
    hasTempleStay: true
  },
  해인사: {
    id: "haeinsa",
    name: "해인사",
    location: "경남 합천군 가야면 해인사길 122",
    direction: "대구역에서 합천행 버스 이용 약 1시간 30분",
    description: "팔만대장경을 품은 사찰",
    openingHours: "08:30 ~ 18:00",
    websiteUrl: "https://www.haeinsa.or.kr",
    imageUrl:
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 980,
    tags: ["문화재", "장경판전", "가야산"],
    facilities: ["주차장", "화장실", "템플스테이"],
    contact: { phone: "055-934-3000" },
    hasTempleStay: true
  },
  조계사: {
    id: "jogyesa",
    name: "조계사",
    location: "서울 종로구 우정국로 55",
    direction: "지하철 3호선 안국역 6번 출구에서 도보 5분",
    description: "서울 도심에 위치한 대한불교 조계종의 총본산",
    openingHours: "04:00 ~ 21:00",
    websiteUrl: "http://www.jogyesa.kr",
    imageUrl:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 1120,
    tags: ["도심속", "템플스테이운영", "문화재"],
    facilities: ["주차장", "화장실", "템플스테이"],
    contact: { phone: "02-768-8600" },
    social: {
      instagram: "https://www.instagram.com/jogyesa_official",
      facebook: "https://www.facebook.com/jogyesa"
    },
    hasTempleStay: true
  },
  봉은사: {
    id: "bongeunsa",
    name: "봉은사",
    location: "서울 강남구 봉은사로 531",
    direction: "지하철 9호선 봉은사역 1번 출구에서 도보 5분",
    description: "현대적인 도시와 조화를 이루는 천년고찰",
    openingHours: "04:30 ~ 21:00",
    websiteUrl: "https://www.bongeunsa.org",
    imageUrl:
      "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 920,
    tags: ["강남", "도심속", "템플스테이운영"],
    facilities: ["주차장", "화장실", "템플스테이"],
    contact: { phone: "02-3218-4800" },
    hasTempleStay: true
  },
  통도사: {
    id: "tongdosa",
    name: "통도사",
    location: "경상남도 양산시 하북면 통도사로 108",
    direction: "양산역에서 버스 이용 약 30분",
    description: "삼보사찰 중 하나로 불보사찰로 불리는 통도사",
    openingHours: "08:00 ~ 18:00",
    websiteUrl: "https://tongdosa.or.kr",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    likeCount: 830,
    tags: ["불보사찰", "양산", "템플스테이"],
    facilities: ["주차장", "화장실", "템플스테이"],
    contact: { phone: "055-382-7182" },
    hasTempleStay: true
  }
};

// 2‑5) 지역 태그(중복 선언 방지를 위해 한 번만 정의)
export const regionTags = [
  { id: "all", name: "전체", active: false },
  { id: "seoul", name: "서울", active: true },
  { id: "incheon", name: "인천", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "jeju", name: "제주", active: false },
  { id: "daegu", name: "대구", active: false },
  { id: "ulsan", name: "울산", active: false }
];

/* ------------------------------------------------------------------
 * 3. 사찰 데이터 결합 & 중복(id) 제거
 * ------------------------------------------------------------------ */
/** 세 데이터셋을 하나의 배열로 결합 */
const combinedTemples: Temple[] = [
  ...nearbyTemples,
  ...popularTemples,
  ...Object.values(temples)
];

/** id 기준으로 병합(후행 데이터 우선) */
function mergeTemples(data: Temple[]): Temple[] {
  const map = new Map<string, Temple>();

  data.forEach(t => {
    if (map.has(t.id)) {
      map.set(t.id, { ...map.get(t.id)!, ...t }); // 속성 병합
    } else {
      map.set(t.id, t);
    }
  });

  return [...map.values()];
}

/** 최종 사찰 데이터(중복 없는 배열) */
export const templeData: Temple[] = mergeTemples(combinedTemples);

/* ------------------------------------------------------------------
 * 4. 유틸 함수 (원본 로직 유지)
 * ------------------------------------------------------------------ */
/** 전체 목록 반환 */
export const getTempleList = () => templeData;

/** 찜(likeCount) 순 정렬 */
export const getTopLikedTemples = (limit = 10) =>
  [...templeData]
    .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
    .slice(0, limit);

/** 태그별 필터링 */
export const filterTemplesByTag = (tag: string) =>
  templeData.filter(t => t.tags?.includes(tag));

/** 검색어 필터링 */
export const searchTemples = (query: string) => {
  const q = query.toLowerCase();
  return templeData.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
  );
};
