
export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  direction: string;  // 가는 방법
  price: number;
  likeCount: number;  // 찜 횟수
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

// 템플스테이 데이터
export const templeStays: Record<string, TempleStay> = {
  "봉정사": {
    id: "ts-bongjungsa",
    templeName: "봉정사",
    location: "경상북도 안동시 서후면 봉정사길 222",
    direction: "안동역에서 시내버스 67번 이용 약 40분",
    price: 120000,
    likeCount: 235,
    description: "천년의 숨을 살아있는 고목을 거닐다",
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.bongjungsa.org",
    schedule: [
      { time: "14:00", activity: "입재 및 오리엔테이션" },
      { time: "15:00", activity: "사찰예절 및 108배" },
      { time: "17:00", activity: "저녁 공양" },
      { time: "19:00", activity: "참선 명상" },
      { time: "21:00", activity: "취침" },
      { time: "04:00", activity: "기상 및 새벽 예불" },
      { time: "06:00", activity: "아침 공양" },
      { time: "10:00", activity: "회향식 및 퇴소" }
    ],
    tags: ["문화재", "전통체험", "휴식"]
  },
  "통도사": {
    id: "ts-tongdosa",
    templeName: "통도사",
    location: "경상남도 양산시 하북면 통도사로 108",
    direction: "양산역에서 버스 이용 약 30분",
    price: 95000,
    likeCount: 318,
    description: "마음까지 맑아지는 풍경 속으로",
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.tongdosa.or.kr",
    schedule: [
      { time: "15:00", activity: "입재 및 오리엔테이션" },
      { time: "16:00", activity: "사찰예절 및 참선 명상" },
      { time: "18:00", activity: "저녁 공양" },
      { time: "19:30", activity: "스님과의 차담" },
      { time: "21:00", activity: "취침" },
      { time: "04:30", activity: "기상 및 새벽 예불" },
      { time: "06:00", activity: "아침 공양" },
      { time: "09:00", activity: "회향식 및 퇴소" }
    ],
    tags: ["불교체험", "휴식", "명상"]
  },
  "조계사": {
    id: "ts-jogyesa",
    templeName: "조계사",
    location: "서울 종로구 우정국로 55",
    direction: "지하철 3호선 안국역 6번 출구에서 도보 5분",
    price: 100000,
    likeCount: 215,
    description: "도심 속 하루, 자아를 돌아보는 시간",
    duration: "당일",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "http://www.jogyesa.kr",
    schedule: [
      { time: "09:00", activity: "입재 및 오리엔테이션" },
      { time: "10:00", activity: "사찰 예절 및 108배" },
      { time: "12:00", activity: "점심 공양" },
      { time: "14:00", activity: "명상 및 차담" },
      { time: "16:00", activity: "회향식 및 퇴소" }
    ],
    tags: ["도심", "일일체험", "문화"]
  },
  "해인사": {
    id: "ts-haeinsa",
    templeName: "해인사",
    location: "경남 합천군 가야면 해인사길 122",
    direction: "대구역에서 합천행 버스 이용 약 1시간 30분",
    price: 140000,
    likeCount: 295,
    description: "팔만대장경의 지혜를 품은 산사",
    duration: "1박 2일",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    websiteUrl: "https://www.haeinsa.or.kr",
    schedule: [
      { time: "14:00", activity: "입재 및 오리엔테이션" },
      { time: "15:30", activity: "사찰 예절 및 108배" },
      { time: "17:00", activity: "저녁 공양" },
      { time: "19:00", activity: "참선 명상" },
      { time: "21:00", activity: "취침" },
      { time: "03:30", activity: "기상 및 새벽 예불" },
      { time: "06:00", activity: "아침 공양" },
      { time: "09:00", activity: "장경판전 탐방" },
      { time: "11:00", activity: "회향식 및 퇴소" }
    ],
    tags: ["팔만대장경", "장경판전", "명상"]
  }
};

// 템플스테이 목록을 배열로 반환
export const getTempleStayList = () => {
  return Object.values(templeStays);
};

// 찜 순으로 정렬된 템플스테이 목록 반환
export const getTopLikedTempleStays = (limit = 10) => {
  return getTempleStayList()
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
};

// 검색어 기반 필터링
export const searchTempleStays = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return getTempleStayList().filter(templeStay => 
    templeStay.templeName.toLowerCase().includes(lowercaseQuery) || 
    templeStay.location.toLowerCase().includes(lowercaseQuery) || 
    templeStay.description.toLowerCase().includes(lowercaseQuery)
  );
};

// 태그별 필터링
export const filterTempleStaysByTag = (tag: string) => {
  return getTempleStayList().filter(templeStay => 
    templeStay.tags && templeStay.tags.includes(tag)
  );
};

// 위치 필터
export const locations = [
  { name: "서울", active: true },
  { name: "대구", active: false },
  { name: "부산", active: false },
  { name: "속초", active: false },
  { name: "인천", active: false },
  { name: "제주", active: false },
  { name: "전주", active: false },
];
