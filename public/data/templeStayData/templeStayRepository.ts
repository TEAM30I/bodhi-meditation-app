
// Temple stay data and utilities

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
  tags?: string[];
  schedule: {
    time: string;
    activity: string;
  }[];
}

// Example temple stay data
export const templeStays: Record<string, TempleStay> = {
  "bulguksa-stay": {
    id: "bulguksa-stay",
    templeName: "불국사",
    location: "경상북도 경주시",
    direction: "동쪽",
    price: 50000,
    likeCount: 250,
    description: "천년고찰 불국사에서 진행하는 템플스테이 프로그램입니다.",
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1584633865778-6dbd4d9a4727?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.bulguksa.or.kr/templestay",
    tags: ["경주", "명상", "체험형"],
    schedule: [
      { time: "14:00", activity: "도착 및 오리엔테이션" },
      { time: "15:00", activity: "사찰 예절 배우기" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "명상 시간" },
      { time: "21:00", activity: "취침" },
      { time: "04:00", activity: "새벽 예불" },
      { time: "06:00", activity: "아침 공양" },
      { time: "08:00", activity: "108배" },
      { time: "10:00", activity: "사찰 탐방" },
      { time: "12:00", activity: "점심 공양 및 퇴소" }
    ]
  },
  "haeinsa-stay": {
    id: "haeinsa-stay",
    templeName: "해인사",
    location: "경상남도 합천군",
    direction: "남쪽",
    price: 60000,
    likeCount: 180,
    description: "팔만대장경이 보관된 해인사에서 진행하는 템플스테이입니다.",
    duration: "2박 3일",
    imageUrl: "https://images.unsplash.com/photo-1584634332100-3a8d2b8282e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.haeinsa.or.kr/templestay",
    tags: ["합천", "단풍", "체험형"],
    schedule: [
      { time: "14:00", activity: "도착 및 오리엔테이션" },
      { time: "15:00", activity: "사찰 예절 배우기" },
      { time: "17:00", activity: "저녁 예불" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "108배" },
      { time: "21:00", activity: "취침" },
      { time: "04:00", activity: "새벽 예불" },
      { time: "06:00", activity: "아침 공양" },
      { time: "08:00", activity: "명상" },
      { time: "10:00", activity: "산책" },
      { time: "12:00", activity: "점심 공양" }
    ]
  }
};

export const locations = [
  { name: "서울", active: true },
  { name: "경기", active: false },
  { name: "강원", active: false },
  { name: "충청", active: false },
  { name: "전라", active: false },
  { name: "경상", active: false },
  { name: "제주", active: false }
];

export function getTempleStayList(): TempleStay[] {
  return Object.values(templeStays);
}

export function getTopLikedTempleStays(limit: number = 5): TempleStay[] {
  return Object.values(templeStays)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
}

export function searchTempleStays(query: string): TempleStay[] {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return Object.values(templeStays).filter(templeStay => 
    templeStay.templeName.toLowerCase().includes(lowerQuery) || 
    templeStay.location.toLowerCase().includes(lowerQuery) ||
    templeStay.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterTempleStaysByTag(tag: string): TempleStay[] {
  return Object.values(templeStays).filter(templeStay => 
    templeStay.tags?.includes(tag)
  );
}
