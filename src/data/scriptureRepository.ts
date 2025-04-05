
export interface Scripture {
  id: string;
  title: string;
  categories: string[];
  content: string;
  origin: string;
  lastReadPosition?: number;
  hasStarted?: boolean;
}

export const scriptures = [
  {
    id: "scripture1",
    title: "般若心經 (반야심경)",
    categories: ["금강경", "반야심경"],
    content: `관자재보살이 깊은 반야바라밀다를 행할 때에
색즉시공 공즉시색 색불이공 공불이색
수상행식 역부여시
사리자시제법공상 불생불멸 불구부정 부증불감
시고공중무색 무수상행식 무안이비설신의
무색성향미촉법 무안계 내지무의식계
무무명 역무무명진 내지무노사 역무노사진
무고집멸도 무지역무득 이무소득고
보리살타 의반야바라밀다고 심무가애 무가애고 무유공포
원리전도몽상 구경열반
삼세제불 의반야바라밀다고 득아뇩다라삼먁삼보리
고지반야바라밀다 시대신주 시대명주
시무상주 시무등등주 능제일체고 진실불허
고설반야바라밀다주 즉설주왈
아제 아제 바라아제 바라승아제 모지 사바하
반야심경`,
    origin: "반야바라밀다심경",
    lastReadPosition: 0,
    hasStarted: false
  },
  {
    id: "scripture2",
    title: "般若波羅蜜多心經 (반야바라밀다심경)",
    categories: ["반야심경", "금강경"],
    content: `관자재보살이 깊은 반야바라밀다를 행할 때에
색즉시공 공즉시색 색불이공 공불이색
수상행식 역부여시
사리자시제법공상 불생불멸 불구부정 부증불감
시고공중무색 무수상행식 무안이비설신의
무색성향미촉법 무안계 내지무의식계
무무명 역무무명진 내지무노사 역무노사진
무고집멸도 무지역무득 이무소득고
보리살타 의반야바라밀다고 심무가애 무가애고 무유공포
원리전도몽상 구경열반
삼세제불 의반야바라밀다고 득아뇩다라삼먁삼보리
고지반야바라밀다 시대신주 시대명주
시무상주 시무등등주 능제일체고 진실불허
고설반야바라밀다주 즉설주왈
아제 아제 바라아제 바라승아제 모지 사바하
반야심경`,
    origin: "반야바라밀다심경",
    lastReadPosition: 150,
    hasStarted: true
  },
  {
    id: "scripture3",
    title: "법화경 (法華經)",
    categories: ["법화경"],
    content: `여시아문(如是我聞) 일시 불재 왕사성 기사굴산 중 여대비구중 만이천인구 아라한 제누한진실 무복무미...

세존 가섭보살 등을 보시고 무량 무변 백천만억 아승지겁에 수행한 불법이니라.

여래의 신통력으로 삼천대천세계를 진동케 하여 하늘에서 꽃비를 내리시니라.

불법의 진리를 드러내심이 마치 연꽃이 피어남과 같으니라.

일체중생이 다 함께 불도를 이루리라.`,
    origin: "묘법연화경",
    lastReadPosition: 0,
    hasStarted: false
  },
  {
    id: "scripture4",
    title: "용수경 (龍樹經)",
    categories: ["용수경"],
    content: `공성(空性)은 일체법의 근본이니, 
모든 존재는 자성이 공하고, 
연기로써 생하느니라. 

고정된 실체는 없으나, 
인연화합하여 나타남이 허망하지 않으니, 
중도(中道)를 체득함이 지혜의 완성이니라.

집착을 버리고, 연기의 이치를 깨달으면,
모든 고통에서 벗어나 해탈을 얻으리라.`,
    origin: "중론",
    lastReadPosition: 50,
    hasStarted: true
  }
];

// 각종 경전 카테고리
export const scriptureCategories = [
  { id: "original", label: "원문", active: true },
  { id: "translation", label: "해석본", active: false }
];

// 경전 독송 날짜
export const calendarData = {
  currentMonth: "2025년 4월",
  selectedDate: 9,
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  days: [
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true, isHighlighted: true },
    { day: 4, isCurrentMonth: true, isSelected: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true, isHighlighted: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true, isSelected: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true, isWeekend: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true, isWeekend: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true, isWeekend: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false }
  ]
};

// 독송 일정
export const readingSchedule = [
  {
    id: "reading1",
    date: "4월 9일 화요일",
    title: "명인의 세계를 그린 간송 우종우",
    category: "금강경",
    chapter: "제4장 3절에서 이어하기",
    color: "bg-black",
    textColor: "text-white"
  },
  {
    id: "reading2",
    title: "모든 고통에서 벗어나는 지혜의 말씀",
    category: "반야심",
    chapter: "제1장 4절에서 이어하기",
    color: "bg-red-500",
    textColor: "text-white"
  },
  {
    id: "reading3",
    title: "연민과 구원의 메시지를 전하는 부처의 정신",
    category: "법화경",
    chapter: "제1장 1절에서 시작하기",
    color: "bg-blue-500",
    textColor: "text-white"
  },
  {
    id: "reading4",
    title: "모든 고통에서 벗어나는 지혜의 말씀",
    category: "반야심",
    chapter: "제1장 4절에서 이어하기",
    color: "bg-orange-500",
    textColor: "text-white"
  },
  {
    id: "reading5",
    title: "모든 고통에서 벗어나는 지혜의 말씀",
    category: "용수경",
    chapter: "제1장 4절에서 이어하기",
    color: "bg-green-500",
    textColor: "text-white"
  }
];

// 경전 읽기 진도 데이터
export const scriptureProgress = [
  {
    scriptureId: "scripture2", // 반야심경
    progress: 25.5,
    color: "bg-red-500"
  },
  {
    scriptureId: "scripture4", // 용수경
    progress: 67.8,
    color: "bg-orange-500"
  }
];

// 북마크 데이터
export const bookmarks = [
  {
    id: "bookmark1",
    scriptureId: "scripture1",
    title: "색즉시공 구절",
    position: 50,
    date: "2025-04-01"
  },
  {
    id: "bookmark2",
    scriptureId: "scripture2",
    title: "무고집멸도 부분",
    position: 200,
    date: "2025-04-03"
  }
];
