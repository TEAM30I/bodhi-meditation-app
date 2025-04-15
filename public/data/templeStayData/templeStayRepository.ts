
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
  },
  "ts-tongdosa": {
    id: "ts-tongdosa",
    templeName: "통도사 템플스테이",
    location: "양산시",
    direction: "양산시 하북면 통도사로 108",
    price: 60000,
    likeCount: 295,
    description: "통도사에서 진행하는 1박 2일 템플스테이입니다. 불보종찰 통도사에서 수행자의 삶을 체험해보세요.",
    duration: "1박 2일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Tongdosa+Stay",
    websiteUrl: "https://www.tongdosa.or.kr/templestay",
    schedule: [
      { time: "14:00", activity: "입소 및 오리엔테이션" },
      { time: "15:00", activity: "사찰 예절 및 불교 강좌" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "07:00", activity: "아침 공양" },
      { time: "08:00", activity: "사찰 탐방" },
      { time: "11:00", activity: "퇴소" }
    ],
    tags: ["참선", "불교 강좌", "사찰 탐방"]
  },
  "ts-jogyesa": {
    id: "ts-jogyesa",
    templeName: "조계사 템플스테이",
    location: "서울시",
    direction: "서울시 종로구 우정국로 55",
    price: 40000,
    likeCount: 180,
    description: "도심 속 사찰인 조계사에서 진행하는 당일형 템플스테이로, 바쁜 일상 속에서 잠시 휴식을 취해보세요.",
    duration: "당일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Jogyesa+Stay",
    websiteUrl: "https://www.jogyesa.kr/templestay",
    schedule: [
      { time: "09:00", activity: "입소 및 오리엔테이션" },
      { time: "10:00", activity: "명상 체험" },
      { time: "12:00", activity: "점심 공양" },
      { time: "13:30", activity: "108배" },
      { time: "15:00", activity: "차담" },
      { time: "16:30", activity: "소감 나누기" },
      { time: "17:00", activity: "퇴소" }
    ],
    tags: ["도심 템플스테이", "당일형", "명상"]
  },
  "ts-bongeunsa": {
    id: "ts-bongeunsa",
    templeName: "봉은사 템플스테이",
    location: "서울시",
    direction: "서울시 강남구 봉은사로 531",
    price: 45000,
    likeCount: 210,
    description: "서울 강남 한복판에 위치한 봉은사에서 진행하는, 명상과 힐링에 초점을 맞춘 템플스테이입니다.",
    duration: "당일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Bongeunsa+Stay",
    websiteUrl: "https://www.bongeunsa.org/templestay",
    schedule: [
      { time: "13:00", activity: "입소 및 오리엔테이션" },
      { time: "14:00", activity: "사찰 탐방" },
      { time: "15:30", activity: "차담 및 명상" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "연등 만들기" },
      { time: "21:00", activity: "퇴소" }
    ],
    tags: ["도심 템플스테이", "당일형", "연등 만들기"]
  },
  "ts-songgwangsa": {
    id: "ts-songgwangsa",
    templeName: "송광사 템플스테이",
    location: "순천시",
    direction: "순천시 송광면 송광사길 100",
    price: 65000,
    likeCount: 320,
    description: "승보종찰 송광사에서 진행하는 2박 3일 템플스테이로, 깊은 산속에서 수행자의 삶을 경험해보세요.",
    duration: "2박 3일",
    imageUrl: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Songgwangsa+Stay",
    websiteUrl: "https://www.songgwangsa.org/templestay",
    schedule: [
      { time: "14:00", activity: "입소 및 오리엔테이션" },
      { time: "15:00", activity: "사찰 예절 및 불교 강좌" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "참선" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상" },
      { time: "05:00", activity: "아침 예불" },
      { time: "07:00", activity: "아침 공양" },
      { time: "09:00", activity: "108배" },
      { time: "12:00", activity: "점심 공양" },
      { time: "14:00", activity: "산책 및 명상" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "21:00", activity: "취침" },
      { time: "09:00", activity: "퇴소" }
    ],
    tags: ["산사체험", "장기형", "명상"]
  }
};

export const locations = [
  { name: "서울", active: true },
  { name: "경주", active: false },
  { name: "부산", active: false },
  { name: "합천", active: false },
  { name: "양산", active: false },
  { name: "여수", active: false },
  { name: "순천", active: false }
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
