
export interface Temple {
  id: string;
  name: string;
  location: string;
  distance?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  imageUrl: string;
  openingHours?: string;
  tags?: string[];
  hasParkingLot?: boolean;
  hasTempleStay?: boolean;
}

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

export const popularTemples: Temple[] = [
  {
    id: "temple1",
    name: "불국사 템플스테이",
    location: "경북 경주시",
    rating: 4.5,
    reviews: 22,
    tags: ["전통", "문화재"],
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "temple2",
    name: "봉선사 템플스테이",
    location: "서울 성북구",
    rating: 4.5,
    reviews: 18,
    tags: ["도심", "명상"],
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "temple3",
    name: "통도사",
    location: "경남 양산시",
    rating: 4.8,
    reviews: 32,
    tags: ["불이문", "성보박물관"],
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "temple4",
    name: "월정사",
    location: "강원 평창군",
    rating: 4.7,
    reviews: 27,
    tags: ["전나무숲", "팔각구층석탑"],
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

export const regionTags = [
  { id: "all", name: "전체", active: false },
  { id: "seoul", name: "서울", active: true },
  { id: "incheon", name: "인천", active: false },
  { id: "busan", name: "부산", active: false },
  { id: "jeju", name: "제주", active: false },
  { id: "daegu", name: "대구", active: false },
  { id: "ulsan", name: "울산", active: false }
];
