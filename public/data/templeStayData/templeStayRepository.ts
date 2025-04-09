
// Temple Stay repository data

export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  direction: string;
  price: number;
  likeCount: number;
  description: string;
  duration: string;
  imageUrl: string;
  websiteUrl: string;
  schedule: {
    time: string;
    activity: string;
  }[];
  tags?: string[];
}

export const templeStays: Record<string, TempleStay> = {
  "ts-bulguksa": {
    id: "ts-bulguksa",
    templeName: "불국사 템플스테이",
    location: "경주시",
    direction: "경주시 불국로 385",
    price: 50000,
    likeCount: 482,
    description: "불국사에서 진행하는, 참선을 주제로 한 당일형 템플스테이입니다.",
    duration: "1박 2일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bulguksa+Stay",
    websiteUrl: "https://www.bulguksa.or.kr/templestay",
    schedule: [
      { time: "17:00", activity: "입소 및 오리엔테이션" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "저녁 예불 및 참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "06:00", activity: "참선" },
      { time: "07:00", activity: "아침 공양" },
      { time: "09:00", activity: "퇴소" }
    ],
    tags: ["참선", "명상", "당일형"]
  },
  "ts-haeinsa": {
    id: "ts-haeinsa",
    templeName: "해인사 템플스테이",
    location: "합천군",
    direction: "합천군 가야면 해인사길 122",
    price: 70000,
    likeCount: 361,
    description: "팔만대장경의 본사인 해인사에서 진행하는 1박 2일 템플스테이입니다.",
    duration: "1박 2일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Haeinsa+Stay",
    websiteUrl: "https://www.haeinsa.or.kr/templestay",
    schedule: [
      { time: "15:00", activity: "입소 및 오리엔테이션" },
      { time: "16:00", activity: "사찰 투어" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "저녁 예불 및 참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "06:00", activity: "참선" },
      { time: "07:00", activity: "아침 공양" },
      { time: "08:00", activity: "108배" },
      { time: "09:00", activity: "퇴소" }
    ],
    tags: ["108배", "사찰투어", "팔만대장경"]
  }
};

export const locations = [
  { name: "서울", active: true },
  { name: "경주", active: false },
  { name: "부산", active: false },
  { name: "합천", active: false },
  { name: "양산", active: false },
  { name: "여수", active: false }
];

export function getTempleStayList(): TempleStay[] {
  return Object.values(templeStays);
}

export function getTopLikedTempleStays(limit = 5): TempleStay[] {
  return Object.values(templeStays)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
}

export function searchTempleStays(query: string): TempleStay[] {
  if (!query) return [];
  const lowercaseQuery = query.toLowerCase();
  return Object.values(templeStays).filter(templeStay => 
    templeStay.templeName.toLowerCase().includes(lowercaseQuery) || 
    templeStay.location.toLowerCase().includes(lowercaseQuery) ||
    templeStay.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function filterTempleStaysByTag(tag: string): TempleStay[] {
  return Object.values(templeStays).filter(templeStay => templeStay.tags?.includes(tag));
}
