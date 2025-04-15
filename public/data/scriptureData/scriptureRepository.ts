
// Scripture repository data
import { getScriptureContent, ScriptureContent } from './scriptureContent';
import { imageRepository } from '../imageRepository';

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
  content?: ScriptureContent;
  chapters: ScriptureChapter[];
  progress?: number;
  hasStarted?: boolean;
  lastReadChapter?: string;
  lastPageIndex?: number;
  // Add methods to the interface
  updateReadingProgress?: typeof updateReadingProgress;
  addBookmark?: typeof addBookmark;
}

// Create a function to process scriptures and add content from scriptureContent
const processScriptureData = (scripture: Scripture): Scripture => {
  return {
    ...scripture,
    content: getScriptureContent(scripture.id),
    updateReadingProgress,
    addBookmark
  };
};

export const scriptures: Record<string, Scripture> = {
  "diamond-sutra": processScriptureData({
    id: "diamond-sutra",
    title: "금강경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      progressBg: "#F59E0B"
    },
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
      },
      {
        id: "ch3",
        title: "제3장: 대승정종분",
        original: "수보리 단시일념 시불언역유재가출가보살 발아뇩다라삼먁삼보리심자 응운하주 운하항복기심...",
        explanation: "수보리는 불자 여러분들을 위해 여쭈어 보았습니다. '세존이시여, 선남자 선여인이 아뇩다라삼먁삼보리심을 발하였다면...'"
      },
      {
        id: "ch4",
        title: "제4장: 묘행무주분",
        original: "수보리 보살 응무소주행어보시 소위불주색성향미촉법주시 수보리 보살 응여시보시...",
        explanation: "수보리여, 보살은 옳게 보시를 하되 집착이 없어야 한다. 무엇 때문인가? 주고 받는다는 집착이 없을 때 그 공덕이 헤아릴 수 없이 많아지기 때문이다..."
      },
      {
        id: "ch5",
        title: "제5장: 여리실견분",
        original: "수보리 어의운하 가이색신견여래 불야 세존 불야 불가이색신견여래...",
        explanation: "수보리여, 어떻게 생각하느냐? 부처님의 육신을 보고 여래를 볼 수 있다고 생각하느냐? 아닙니다, 세존이시여. 육신으로 여래를 볼 수 없습니다..."
      }
    ],
    progress: 35,
    hasStarted: true,
    lastReadChapter: "ch1",
    lastPageIndex: 1
  }),
  "heart-sutra": processScriptureData({
    id: "heart-sutra",
    title: "반야심경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      progressBg: "#3B82F6"
    },
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
      },
      {
        id: "ch3",
        title: "결론",
        original: "시제법공상 불생불멸 불구부정 불증불감 시고공중무색 무수상행식...",
        explanation: "이러한 공의 세계에는 태어남도 없고 죽음도 없으며, 깨끗함도 더러움도 없고, 늘어남도 줄어듦도 없다..."
      }
    ],
    progress: 50,
    hasStarted: true,
    lastReadChapter: "ch2",
    lastPageIndex: 3
  }),
  "lotus-sutra": processScriptureData({
    id: "lotus-sutra",
    title: "법화경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      progressBg: "#E11D48"
    },
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
      },
      {
        id: "ch3",
        title: "비유품",
        original: "수보리 여시묘법 여래여조삼세제불소설 소수소설 소호소장...",
        explanation: "수보리여, 이처럼 좋은 법은 여래가 모든 과거, 현재, 미래의 부처님들처럼 가르치는 것이다..."
      }
    ],
    progress: 20,
    hasStarted: true,
    lastReadChapter: "ch1",
    lastPageIndex: 2
  }),
  "sixpatriarch-sutra": processScriptureData({
    id: "sixpatriarch-sutra",
    title: "육조단경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-green-100",
      text: "text-green-800",
      progressBg: "#10B981"
    },
    chapters: [
      {
        id: "ch1",
        title: "행록편",
        original: "법원대사자 재대적국왕법주 입중국제구대종분지 역명혜능 부위성현 복주범양현...",
        explanation: "대사께서는 법회에서 선남자 선여인들에게 다음과 같이 말씀하셨다..."
      },
      {
        id: "ch2",
        title: "반야편",
        original: "차일조사 지광주보차사 시면연불법교단 사부대중집...",
        explanation: "어느 날, 오조 대사께서는 신수와 혜능을 포함한 여러 제자들이 모인 법회에서 말씀하셨다..."
      },
      {
        id: "ch3",
        title: "정의편",
        original: "사부대중문법하여언 선지식 정혜본동원 약인분별음성 예불초간청법...",
        explanation: "여러 신도들이 법회에 모여 지혜로운 분께 여쭈었다. '선지식이시여, 선정과 지혜는 원래 하나인데...'"
      }
    ],
    progress: 0,
    hasStarted: false
  }),
  "avatamsaka-sutra": processScriptureData({
    id: "avatamsaka-sutra",
    title: "화엄경",
    categories: ["불경"],
    colorScheme: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      progressBg: "#FFB23F"
    },
    chapters: [
      {
        id: "ch1",
        title: "세계성취품",
        original: "여시아문 일시불재보리도장업새장엄 성정각수 엄위자재 제어법계...",
        explanation: "이와 같이 내가 들었다. 한때 부처님께서는 보리도량에 계시면서 깨달음을 이루신 직후였다..."
      },
      {
        id: "ch2",
        title: "여래명호품",
        original: "이시세존 재보리수하 처이기정각 득제불주 성무등각 노명독존 모라자위...",
        explanation: "이때 세존께서는 보리수 아래에서 이미 깨달음을 이루셨지만, 모든 불법을 얻어 위없는 깨달음을 이루셨음을 아직 설하지 않으셨다..."
      },
      {
        id: "ch3",
        title: "여래광명각품",
        original: "이시이십일형차세계 제찰지외 유대보화장사자지세계 세계탁 엄관장자시세계...",
        explanation: "이때 이십일 형차세계의 모든 세계 밖에 대보화장사자지라는 세계가 있었는데..."
      }
    ],
    progress: 65,
    hasStarted: true,
    lastReadChapter: "ch2",
    lastPageIndex: 4
  })
};

export const scriptureCategories = [
  { id: "sutra", name: "경전", active: true },
  { id: "vinaya", name: "율장", active: false },
  { id: "abhidharma", name: "논장", active: false }
];

export const readingSchedule: ReadingScheduleItem[] = [
  { id: 1, scriptureId: "diamond-sutra", chapter: "제1장: 법회인유분", title: "금강경 법회인유분", progress: 35 },
  { id: 2, scriptureId: "heart-sutra", chapter: "정종분", title: "반야심경 정종분", progress: 50 },
  { id: 3, scriptureId: "avatamsaka-sutra", chapter: "세계성취품", title: "화엄경 세계성취품", progress: 65 }
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
  },
  {
    id: "bm3",
    scriptureId: "avatamsaka-sutra",
    chapterId: "ch1",
    pageIndex: 2,
    title: "화엄경 제1장",
    date: "2025-04-05"
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
