
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
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
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
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
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
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
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
    imageUrl: "https://images.unsplash.com/photo-1526602367853-61a536f40855?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
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
