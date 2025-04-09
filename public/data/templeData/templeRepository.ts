
export interface Temple {
  id: string;
  name: string;
  location: string;
  direction?: string;  // 가는 방법
  description?: string;
  likeCount: number;   // 찜 횟수
  distance?: string;
  imageUrl: string;
  websiteUrl?: string;
  tags?: string[];
  openingHours?: string;
  hasParkingLot?: boolean;
  hasTempleStay?: boolean;
}

// 주요 사찰 데이터
export const temples: Record<string, Temple> = {
  "불국사": {
    id: "bulguksa",
    name: "불국사",
    location: "경북 경주시 불국로 385",
    direction: "경주역에서 버스 10번, 11번 이용 약 20분",
    description: "천년의 역사를 간직한 고찰",
    likeCount: 1205,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.bulguksa.or.kr",
    tags: ["문화재", "역사", "관광명소"],
    openingHours: "08:00 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  "해인사": {
    id: "haeinsa",
    name: "해인사",
    location: "경남 합천군 가야면 해인사길 122",
    direction: "대구역에서 합천행 버스 이용 약 1시간 30분",
    description: "팔만대장경을 품은 사찰",
    likeCount: 980,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.haeinsa.or.kr",
    tags: ["문화재", "장경판전", "가야산"],
    openingHours: "08:30 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  "미륵사": {
    id: "mireuksa",
    name: "미륵사",
    location: "전북 익산시 금마면 미륵사지로 362",
    direction: "익산역에서 시내버스 41번 이용 약 30분",
    description: "백제 문화의 정수",
    likeCount: 745,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "http://www.mireuksaji.org",
    tags: ["백제", "문화재", "석탑"],
    openingHours: "09:00 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: false
  },
  "송광사": {
    id: "songgwangsa",
    name: "송광사",
    location: "전남 순천시 송광면 송광사안길 100",
    direction: "순천역에서 버스 이용 약 40분",
    description: "승보사찰의 명성",
    likeCount: 830,
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.songgwangsa.org",
    tags: ["승보사찰", "산사", "템플스테이"],
    openingHours: "08:00 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  "법주사": {
    id: "beopjusa",
    name: "법주사",
    location: "충북 보은군 속리산면 법주사로 379",
    direction: "청주고속버스터미널에서 보은행 버스 이용 약 1시간",
    description: "속리산의 아름다운 사찰",
    likeCount: 660,
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "http://www.beopjusa.org",
    tags: ["속리산", "철확대불", "템플스테이운영"],
    openingHours: "08:30 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  "조계사": {
    id: "jogyesa",
    name: "조계사",
    location: "서울 종로구 우정국로 55",
    direction: "지하철 3호선 안국역 6번 출구에서 도보 5분",
    description: "서울 도심에 위치한 대한불교 조계종의 총본산",
    likeCount: 1120,
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "http://www.jogyesa.kr",
    tags: ["도심속", "템플스테이운영", "문화재"],
    openingHours: "04:00 ~ 21:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  "봉은사": {
    id: "bongeunsa",
    name: "봉은사",
    location: "서울 강남구 봉은사로 531",
    direction: "지하철 9호선 봉은사역 1번 출구에서 도보 5분",
    description: "현대적인 도시와 조화를 이루는 천년고찰",
    likeCount: 920,
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.bongeunsa.org",
    tags: ["강남", "도심속", "템플스테이운영"],
    openingHours: "04:30 ~ 21:00",
    hasParkingLot: true,
    hasTempleStay: true
  }
};

// 근처 사찰 목록을 텐플 객체의 배열로 변환
export const getTempleList = () => {
  return Object.values(temples);
};

// 찜 순으로 정렬된 사찰 목록 반환
export const getTopLikedTemples = (limit = 10) => {
  return getTempleList()
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
};

// 태그별 필터링
export const filterTemplesByTag = (tag: string) => {
  return getTempleList().filter(temple => 
    temple.tags && temple.tags.includes(tag)
  );
};

// 검색어 기반 필터링
export const searchTemples = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return getTempleList().filter(temple => 
    temple.name.toLowerCase().includes(lowercaseQuery) || 
    temple.location.toLowerCase().includes(lowercaseQuery) || 
    (temple.description && temple.description.toLowerCase().includes(lowercaseQuery))
  );
};

// 지역 태그
export const regionTags = [
  { id: "all", name: "전체", active: false },
  { id: "seoul", name: "서울", active: true },
  { id: "incheon", name: "인천", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "jeju", name: "제주", active: false },
  { id: "daegu", name: "대구", active: false },
  { id: "ulsan", name: "울산", active: false }
];
