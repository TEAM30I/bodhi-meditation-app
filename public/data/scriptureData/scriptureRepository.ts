
// Scripture repository data

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

export interface ReadingProgress {
  scriptureId: string;
  chapterId: string;
  pageIndex: number;
  progress: number;
}

export interface ReadingScheduleItem {
  id: number;
  scriptureId: string;
  chapter: string;
  title: string;
  progress: number;
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

export const scriptures: Record<string, Scripture> = {
  "diamond-sutra": {
    id: "diamond-sutra",
    title: "금강경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      progressBg: "#F59E0B"
    },
    content: "여시아문 일시불재사위국 기수급고독원 여대비구중 천이백오십인구 이식시불욕착의지발 입성지분발 시초평욕식시 착의지발 입성지분발 식득환지거 종좌식식시세존 위재대중 설법라 시장자수달다 종회중좌 시세존고장자수달다 선재 시장자수달다 문석가모니불언 세존 선남자 선녀인 발아뇩다라삼먁삼보리심 응운하주 운하항복기심…",
    chapters: [
      {
        id: "ch1",
        title: "제1장: 법회인유분",
        original: "여시아문 일시불재사위국 기수급고독원 여대비구중 천이백오십인구...",
        explanation: "이와 같이 내가 들었다. 한 때 부처님께서는 사위국 기수급고독원에 계시면서 큰 비구의 무리 천이백오십 명과 함께 계셨다..."
      },
      {
        id: "ch2",
        title: "제2장: 선현기청분",
        original: "시장자수달다 종회중좌 시세존고장자수달다 선재...",
        explanation: "그때 장자 수달다가 대중 가운데 앉아있었다. 세존께서 장자 수달다에게 말씀하셨다..."
      }
    ],
    progress: 35,
    hasStarted: true,
    lastReadChapter: "ch1",
    lastPageIndex: 1
  },
  "heart-sutra": {
    id: "heart-sutra",
    title: "반야심경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      progressBg: "#3B82F6"
    },
    content: "관자재보살 행심반야바라밀다시 조견오온개공 도일체고액 사리자 색불이공 공불이색 색즉시공 공즉시색 수상행식 역부여시 사리자 시제법공상 불생불멸 불구부정 불증불감 시고공중무색 무수상행식 무안이비설신의 무색성향미촉법 무안계내지무의식계 무무명역 무무명진 내지무로사 역무로사진 무고집멸도 무지역무득 이무소득고 보리살타 의반야바라밀다고 심무가애 무가애고 무유공포 원리전도몽상 구경열반...",
    chapters: [
      {
        id: "ch1",
        title: "서분",
        original: "관자재보살 행심반야바라밀다시 조견오온개공 도일체고액",
        explanation: "관세음보살이 깊은 반야바라밀다를 행할 때 오온이 모두 공함을 비추어 보고 온갖 고통에서 벗어났다."
      },
      {
        id: "ch2",
        title: "정종분",
        original: "사리자 색불이공 공불이색 색즉시공 공즉시색 수상행식 역부여시...",
        explanation: "사리자여, 색은 공과 다르지 않고 공은 색과 다르지 않으며, 색이 곧 공이고 공이 곧 색이다..."
      }
    ],
    progress: 50,
    hasStarted: true,
    lastReadChapter: "ch2",
    lastPageIndex: 3
  },
  "lotus-sutra": {
    id: "lotus-sutra",
    title: "법화경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      progressBg: "#E11D48"
    },
    content: "여시아문 일시불재영취산중 여대비구중 만이천인구 개아라한 제루진진 심선자재 소작이변 선두방편 제법실상...",
    chapters: [
      {
        id: "ch1",
        title: "서품",
        original: "여시아문 일시불재영취산중 여대비구중 만이천인구...",
        explanation: "이와 같이 내가 들었다. 한 때 부처님께서는 영취산에 계시면서 큰 비구의 무리 만 이천 명과 함께 계셨다..."
      },
      {
        id: "ch2",
        title: "방편품",
        original: "시불세존 종삼매안정 외기몽산 위제보살 설대승경 명묘법연화 교보살법 불소호경...",
        explanation: "그때 세존께서는 삼매에서 나오셔서 수보리에게 말씀하셨다..."
      }
    ],
    progress: 20,
    hasStarted: true,
    lastReadChapter: "ch1",
    lastPageIndex: 2
  }
};

export const scriptureCategories = [
  { id: "sutra", name: "경전", active: true },
  { id: "vinaya", name: "율장", active: false },
  { id: "abhidharma", name: "논장", active: false }
];

export const readingSchedule: ReadingScheduleItem[] = [
  { id: 1, scriptureId: "diamond-sutra", chapter: "제1장: 법회인유분", title: "금강경 법회인유분", progress: 35 },
  { id: 2, scriptureId: "heart-sutra", chapter: "정종분", title: "반야심경 정종분", progress: 50 }
];

export const bookmarks: Bookmark[] = [
  {
    id: "bm1",
    scriptureId: "diamond-sutra",
    chapterId: "ch1",
    pageIndex: 1,
    title: "금강경 제1장",
    date: "2025-03-15",
    note: "중요한 구절"
  },
  {
    id: "bm2",
    scriptureId: "heart-sutra",
    chapterId: "ch2",
    pageIndex: 3,
    title: "반야심경 제2장",
    date: "2025-03-20"
  }
];

// Sample calendar data for displaying in the calendar view
export const calendarData = [
  { date: new Date(2025, 3, 1), title: "금강경", completed: true, progress: 100 },
  { date: new Date(2025, 3, 5), title: "반야심경", completed: true, progress: 85 },
  { date: new Date(2025, 3, 9), title: "금강경", completed: false, progress: 45 },
  { date: new Date(2025, 3, 15), title: "법화경", completed: false, progress: 25 },
  { date: new Date(), title: "반야심경", completed: false, progress: 10 }
];

export function getScriptureById(id: string): Scripture | undefined {
  return scriptures[id];
}

export function updateReadingProgress(
  scriptureId: string, 
  progress: number, 
  chapterId: string, 
  pageIndex: number
): void {
  if (scriptures[scriptureId]) {
    scriptures[scriptureId].progress = progress;
    scriptures[scriptureId].hasStarted = true;
    scriptures[scriptureId].lastReadChapter = chapterId;
    scriptures[scriptureId].lastPageIndex = pageIndex;
  }
}

export function addBookmark(
  userId: string,
  scriptureId: string,
  chapterId: string,
  pageIndex: number,
  title: string
): Bookmark {
  const newBookmark: Bookmark = {
    id: `bm${bookmarks.length + 1}`,
    scriptureId,
    chapterId,
    pageIndex,
    title,
    date: new Date().toISOString().substring(0, 10)
  };
  
  bookmarks.push(newBookmark);
  return newBookmark;
}
