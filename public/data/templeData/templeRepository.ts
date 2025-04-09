
export interface Temple {
  id: string;
  name: string;
  location: string;
  description?: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  imageUrl: string;
  tags?: string[];
  openingHours?: string;
  hasParkingLot?: boolean;
  hasTempleStay?: boolean;
}

export const temples: Temple[] = [
  {
    id: "bulguksa",
    name: "불국사",
    location: "경북 경주시",
    description: "천년의 역사를 간직한 고찰",
    rating: 4.8,
    reviews: 120,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["문화재", "역사", "관광명소"],
    openingHours: "08:00 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  {
    id: "haeinsa",
    name: "해인사",
    location: "경남 합천군",
    description: "팔만대장경을 품은 사찰",
    rating: 4.7,
    reviews: 95,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["문화재", "장경판전", "가야산"],
    openingHours: "08:30 ~ 18:00",
    hasParkingLot: true,
    hasTempleStay: true
  },
  {
    id: "mireuksa",
    name: "미륵사",
    location: "전북 익산시",
    description: "백제 문화의 정수",
    rating: 4.6,
    reviews: 78,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["백제", "문화재", "석탑"]
  },
  {
    id: "songgwangsa",
    name: "송광사",
    location: "전남 순천시",
    description: "승보사찰의 명성",
    rating: 4.7,
    reviews: 82,
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["승보사찰", "산사", "템플스테이"]
  },
  {
    id: "beopjusa",
    name: "법주사",
    location: "충북 보은군",
    description: "속리산의 아름다운 사찰",
    rating: 4.5,
    reviews: 67,
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["속리산", "철확대불", "템플스테이운영"]
  },
  {
    id: "jogyesa",
    name: "조계사",
    location: "서울 종로구",
    description: "서울 도심에 위치한 대한불교 조계종의 총본산",
    rating: 4.6,
    reviews: 110,
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    distance: "도보 10분",
    tags: ["도심속", "템플스테이운영", "문화재"]
  },
  {
    id: "bongeunsa",
    name: "봉은사",
    location: "서울 강남구",
    description: "현대적인 도시와 조화를 이루는 천년고찰",
    rating: 4.5,
    reviews: 95,
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    distance: "지하철 5분",
    tags: ["강남", "도심속", "템플스테이운영"]
  }
];

// Add the nearbyTemples export that's missing
export const nearbyTemples: Temple[] = [
  {
    id: "bulguksa-nearby",
    name: "불국사",
    location: "경북 경주시",
    distance: "도보 10분",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "haeinsa-nearby",
    name: "해인사",
    location: "경남 합천군",
    distance: "도보 10분",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

// Add regionTags that might be needed elsewhere
export const regionTags = [
  { id: "all", name: "전체", active: false },
  { id: "seoul", name: "서울", active: true },
  { id: "incheon", name: "인천", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "jeju", name: "제주", active: false },
  { id: "daegu", name: "대구", active: false },
  { id: "ulsan", name: "울산", active: false }
];

