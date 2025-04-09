
export interface TempleStay {
  id: string;
  name: string;
  temple: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  duration: string;
  imageUrl: string;
  distance?: string;
  tags?: string[];
}

export const templeStays: TempleStay[] = [
  {
    id: "ts1",
    name: "봉정사 템플스테이",
    temple: "봉정사",
    location: "경상북도 영주",
    price: 120000,
    rating: 4.5,
    reviews: 22,
    description: "천년의 숨을 살아있는 고목을 거닐다",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["문화재", "전통체험", "휴식"]
  },
  {
    id: "ts2",
    name: "통도사 템플스테이",
    temple: "통도사",
    location: "경상남도 양산",
    price: 95000,
    rating: 4.3,
    reviews: 18,
    description: "마음까지 맑아지는 풍경 속으로",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["불교체험", "휴식", "명상"]
  },
  {
    id: "ts3",
    name: "월정사 템플스테이",
    temple: "월정사",
    location: "강원도 평창",
    price: 110000,
    rating: 4.7,
    reviews: 25,
    description: "오대산의 품에 안긴 사찰 체험",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["산사", "명상", "휴식"]
  },
  {
    id: "ts4",
    name: "봉선사 템플스테이",
    temple: "봉선사",
    location: "경기도 남양주",
    price: 130000,
    rating: 4.6,
    reviews: 20,
    description: "도심 속 힐링, 나를 찾는 여행",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1526602367853-61a536f40855?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["도심근교", "명상", "문화체험"]
  },
  {
    id: "ts5",
    name: "석굴암 템플스테이",
    temple: "석굴암",
    location: "경상북도 경주",
    price: 150000,
    rating: 4.8,
    reviews: 30,
    description: "천년 불교 문화의 정수를 체험",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["역사유적", "불교체험", "명상"]
  },
  {
    id: "ts6",
    name: "조계사 템플스테이",
    temple: "조계사",
    location: "서울 종로구",
    price: 100000,
    rating: 4.4,
    reviews: 15,
    description: "도심 속 하루, 자아를 돌아보는 시간",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    tags: ["도심", "일일체험", "문화"]
  }
];

export const nearbyTempleStays: TempleStay[] = [
  {
    id: "ts-nearby1",
    name: "법주사 템플스테이",
    temple: "법주사",
    location: "충북 보은군",
    price: 110000,
    rating: 4.7,
    reviews: 28,
    description: "속리산의 아름다운 산사에서의 하루",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    distance: "도보 10분",
    tags: ["속리산", "휴식", "명상"]
  },
  {
    id: "ts-nearby2",
    name: "해인사 템플스테이",
    temple: "해인사",
    location: "경남 합천군",
    price: 140000,
    rating: 4.9,
    reviews: 35,
    description: "팔만대장경의 지혜를 품은 산사",
    duration: "1박",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    distance: "도보 15분",
    tags: ["팔만대장경", "장경판전", "명상"]
  }
];

export const locations = [
  { name: "서울", active: true },
  { name: "대구", active: false },
  { name: "부산", active: false },
  { name: "속초", active: false },
  { name: "인천", active: false },
  { name: "제주", active: false },
  { name: "전주", active: false },
];

export const secondLocations = [
  { name: "서울", active: false },
  { name: "대구", active: true },
  { name: "부산", active: false },
  { name: "속초", active: false },
  { name: "인천", active: false },
  { name: "제주", active: false },
  { name: "전주", active: false },
];
