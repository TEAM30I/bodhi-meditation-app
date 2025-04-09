
/* ------------------------------------------------------------
 * 📚 통합 불교 경전 데이터베이스 (Single‑Source of Truth)
 * ------------------------------------------------------------
 *  - 최상위 키: 경전 이름
 *  - 각 경전은 "meta"(고정) + "users"(동적) 두 영역으로 구성
 *  - 서버에서 전달받은 userId 로 users[userId] 접근 → 북마크·진도·스케줄 관리
 *  - 다른 모듈은 오직 이 객체만 import 하여 파싱하면 됨
 * ------------------------------------------------------------
 */

/* ------------------------------------------------------------------
 * 1. 타입 선언
 * ------------------------------------------------------------------*/
export interface ScriptureColorScheme {
  bg: string;
  text: string;
  progressBg: string;
}

export interface ScriptureChapter {
  id: string;
  title: string;
  original: string;
  explanation: string;
}

export interface Bookmark {
  id: string;
  scriptureId: string;
  chapterId: string;
  pageIndex: number;
  title: string;
  note?: string;
  date: string;
}

export interface ReadingScheduleItem {
  id: number;
  scriptureId: string;
  chapter: string;
  title: string;
  progress: number; // %
}

export interface UserScriptureData {
  lastReadPosition: number;
  lastReadChapter: string;
  lastPageIndex: number;
  progress: number;
  bookmarks: Bookmark[];
  schedule: ReadingScheduleItem[];
}

export interface ScriptureMeta {
  id: string;
  title: string;
  categories: string[];
  colorScheme: ScriptureColorScheme;
  content: string;
  chapters: ScriptureChapter[];
}

export interface ScriptureDBEntry {
  meta: ScriptureMeta;
  users: Record<string, UserScriptureData>; // key = userId
}

export interface Scripture {
  id: string;
  title: string;
  categories: string[];
  colorScheme: ScriptureColorScheme;
  content: string;
  chapters: ScriptureChapter[];
  progress?: number;
  hasStarted?: boolean;
  lastReadChapter?: string;
  lastPageIndex?: number;
}

export interface ReadingProgress {
  scriptureId: string;
  progress: number;
  completedPages: number;
  totalPages: number;
}

/* ------------------------------------------------------------------
 * 2. 공통 컬러 스키마
 * ------------------------------------------------------------------*/
const COLOR_SCHEMES = {
  DARK:   { bg: "bg-[#21212F]", text: "text-white", progressBg: "#FF4D00" },
  RED:    { bg: "bg-[#EF4223]", text: "text-white", progressBg: "#FF9B21" },
  BLUE:   { bg: "bg-[#0080FF]", text: "text-white", progressBg: "#0080FF" },
  ORANGE: { bg: "bg-[#FFB23F]", text: "text-white", progressBg: "#FFB23F" },
  GREEN:  { bg: "bg-[#4CAF50]", text: "text-white", progressBg: "#4CAF50" },
} as const satisfies Record<string, ScriptureColorScheme>;

/* ------------------------------------------------------------------
 * 3. 본문 데이터 (메타) – 길이 제한 없는 확장 버전
 * ------------------------------------------------------------------*/
const META: Record<string, ScriptureMeta> = {
  "금강경": {
    id: "diamond-sutra",
    title: "금강경",
    categories: ["금강경", "대승경전"],
    colorScheme: COLOR_SCHEMES.DARK,
    content: `如是我聞：一時佛在舍衛國祇樹給孤獨園，與大比丘衆千二百五十人俱。\n爾時世尊食時，著衣持鉢，入舍衛大城乞食。於其城中，次第乞已，還至本處。飯食訖，收衣鉢，洗足已，敷座而坐。\n…… (중략 – 제1분부터 제32분까지 한문 원문 전체 수록) ……`,
    chapters: [
      { id: "ch1", title: "1. 법회인유분", original: "如是我聞...", explanation: "금강경 설법의 배경." },
      { id: "ch2", title: "2. 선현기청분", original: "爾時 長老須菩提...", explanation: "수보리의 질문." },
      { id: "ch3", title: "3. 대승정종분", original: "佛言 善哉善哉...", explanation: "무주심 보살행." },
      { id: "ch4", title: "4. 묘행무주분", original: "菩薩應如是降伏其心...", explanation: "집착 없는 행." },
    ],
  },
  "반야심경": {
    id: "heart-sutra",
    title: "반야심경",
    categories: ["반야심경", "대승경전"],
    colorScheme: COLOR_SCHEMES.RED,
    content: `觀自在菩薩 行深般若波羅蜜多時 照見五蘊皆空 度一切苦厄...\n揭諦揭諦 波羅揭諦 波羅僧揭諦 菩提薩婆訶`,
    chapters: [
      { id: "ch1", title: "전체 경문", original: "觀自在菩薩...", explanation: "공(空)의 지혜." },
    ],
  },
  "법화경": {
    id: "lotus-sutra",
    title: "법화경",
    categories: ["법화경", "대승경전"],
    colorScheme: COLOR_SCHEMES.BLUE,
    content: `如是我聞：一時佛住王舍城耆闍崛山中... (서품·방편품 발췌 포함)`,
    chapters: [
      { id: "ch1", title: "1. 서품", original: "如是我聞...", explanation: "법화경 서막." },
      { id: "ch2", title: "2. 방편품", original: "爾時 世尊...", explanation: "일승 방편." },
    ],
  },
  "화엄경": {
    id: "avatamsaka-sutra",
    title: "화엄경",
    categories: ["화엄경", "대승경전"],
    colorScheme: COLOR_SCHEMES.ORANGE,
    content: `如是我聞：一時 佛成道已 於摩訶菩提場... (입법계품·현화품)`,
    chapters: [
      { id: "ch1", title: "1. 입법계품", original: "如是我聞...", explanation: "법계광명." },
      { id: "ch2", title: "2. 현화품", original: "爾時 十方...", explanation: "화엄세계 현현." },
    ],
  },
  "용수경": {
    id: "nagarjuna-sutra",
    title: "용수경",
    categories: ["용수경", "대승경전"],
    colorScheme: COLOR_SCHEMES.GREEN,
    content: `龍樹菩薩告諸比丘：「若人欲得成佛道者 當觀諸法實相...」`,
    chapters: [
      { id: "ch1", title: "1. 중관의 문", original: "空不亦空...", explanation: "팔불중도." },
    ],
  },
  "육조단경": {
    id: "platform-sutra",
    title: "육조단경",
    categories: ["육조단경", "선종"],
    colorScheme: COLOR_SCHEMES.GREEN,
    content: `時惠能至寶林寺 參見印宗大師... (무상송 등 전체 수록)`,
    chapters: [
      { id: "ch1", title: "1. 출가인연", original: "吾前世與汝有緣...", explanation: "혜능 출가." },
      { id: "ch2", title: "2. 무상송", original: "菩提本無樹...", explanation: "공적영지." },
    ],
  },
};

/* ------------------------------------------------------------------
 * 4. 사용자‑별 동적 영역 (초기값 비움)  👉 서버 로직에서 주입/갱신
 * ------------------------------------------------------------------*/
const EMPTY_USER_DATA: UserScriptureData = {
  lastReadPosition: 0,
  lastReadChapter: "",
  lastPageIndex: 0,
  progress: 0,
  bookmarks: [],
  schedule: [],
};

/* ------------------------------------------------------------------
 * 5. 통합 DB 객체
 * ------------------------------------------------------------------*/
export const scriptureDB: Record<string, ScriptureDBEntry> = Object.fromEntries(
  Object.entries(META).map(([name, meta]) => [name, { meta, users: {} }]),
);

// 헬퍼: user 데이터 접근 보조 (필요 시 사용)
export const getUserData = (scriptureName: string, userId: string): UserScriptureData => {
  const entry = scriptureDB[scriptureName];
  if (!entry) throw new Error(`Unknown scripture: ${scriptureName}`);
  if (!entry.users[userId]) entry.users[userId] = { ...EMPTY_USER_DATA };
  return entry.users[userId];
};

// 페이지에서 쓰일 데이터 - 스크립처 객체
export const scriptures: Record<string, Scripture> = Object.fromEntries(
  Object.entries(META).map(([name, meta]) => [
    name, 
    {
      ...meta,
      progress: Math.floor(Math.random() * 100), // 임시 진도율
      hasStarted: Math.random() > 0.5, // 임시 시작 여부
      lastReadChapter: meta.chapters[0].id, // 첫번째 챕터로 설정
      lastPageIndex: 0
    }
  ])
);

// 경전 카테고리
export const scriptureCategories = [
  { id: "sutra", name: "경", active: true },
  { id: "vinaya", name: "율", active: false },
  { id: "shastra", name: "론", active: false },
  { id: "zen", name: "선", active: false }
];

// 읽기 일정
export const readingSchedule: ReadingScheduleItem[] = [
  { id: 1, scriptureId: "diamond-sutra", chapter: "1장", title: "금강경 1장", progress: 35 },
  { id: 2, scriptureId: "heart-sutra", chapter: "전체", title: "반야심경 전체", progress: 60 },
  { id: 3, scriptureId: "lotus-sutra", chapter: "2장", title: "법화경 2장", progress: 15 }
];

// 북마크 데이터
export const bookmarks: Bookmark[] = [
  {
    id: "bm1",
    scriptureId: "diamond-sutra",
    chapterId: "ch1",
    pageIndex: 2,
    title: "법회인유분 중요 구절",
    note: "중요한 내용, 나중에 다시 읽기",
    date: "2025-04-01"
  },
  {
    id: "bm2",
    scriptureId: "heart-sutra",
    chapterId: "ch1",
    pageIndex: 0,
    title: "반야심경 시작 부분",
    date: "2025-04-03"
  },
  {
    id: "bm3",
    scriptureId: "lotus-sutra",
    chapterId: "ch2",
    pageIndex: 1,
    title: "방편품 주요 가르침",
    note: "수행에 적용할 내용",
    date: "2025-04-05"
  }
];

// 경전 캘린더 데이터
export const calendarData = [
  {
    date: new Date(2025, 3, 1), // 2025-04-01
    title: "금강경",
    completed: true,
    progress: 25.5
  },
  {
    date: new Date(2025, 3, 3), // 2025-04-03
    title: "반야심경",
    completed: true,
    progress: 42.0
  },
  {
    date: new Date(2025, 3, 5), // 2025-04-05
    title: "법화경",
    completed: false,
    progress: 10.2
  },
  {
    date: new Date(2025, 3, 7), // 2025-04-07
    title: "금강경",
    completed: false,
    progress: 30.0
  },
  {
    date: new Date(2025, 3, 9), // 2025-04-09 (오늘)
    title: "반야심경",
    completed: false,
    progress: 45.0
  }
];

// 경전 데이터 접근 함수들
export const getScriptureById = (id: string): Scripture | undefined => {
  return Object.values(scriptures).find(s => s.id === id);
};

export const updateReadingProgress = (scriptureId: string, progress: number, chapterId: string, pageIndex: number) => {
  const scripture = getScriptureById(scriptureId);
  if (scripture) {
    scripture.progress = progress;
    scripture.lastReadChapter = chapterId;
    scripture.lastPageIndex = pageIndex;
  }
};

export const addBookmark = (userId: string, scriptureId: string, chapterId: string, pageIndex: number, title: string) => {
  const newBookmark: Bookmark = {
    id: `bm${bookmarks.length + 1}`,
    scriptureId,
    chapterId,
    pageIndex,
    title,
    date: new Date().toISOString().split('T')[0]
  };
  
  bookmarks.push(newBookmark);
  return newBookmark;
};
