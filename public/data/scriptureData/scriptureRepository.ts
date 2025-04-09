
// Define color schemes for each scripture
export interface ScriptureColorScheme {
  bg: string;
  text: string;
  progressBg: string;
}

// Define chapter structure
export interface ScriptureChapter {
  id: string;
  title: string;
  original: string;
  explanation: string;
}

// Define scripture interface
export interface Scripture {
  id: string;
  title: string;
  categories: string[];
  colorScheme: ScriptureColorScheme;
  content: string;
  chapters: ScriptureChapter[];
  hasStarted?: boolean;
  lastReadPosition?: number;
  progress?: number;
  lastReadChapter?: string;
  lastPageIndex?: number;
}

// Interface for reading progress
export interface ReadingProgress {
  userId: string;
  scriptureId: string;
  lastReadPosition: number;
  completedChapters: string[];
  lastReadTimestamp: Date;
}

// Interface for bookmark
export interface Bookmark {
  id: string;
  userId: string;
  scriptureId: string;
  chapterId: string;
  pageIndex: number;
  title: string;
  note?: string;
  createdAt: Date;
  date?: string;
}

// Scripture categories for filtering
export const scriptureCategories = [
  { id: 'original', label: '원문' },
  { id: 'translation', label: '번역문' },
  { id: 'annotation', label: '주석' },
  { id: 'interpretation', label: '해설' }
];

// Color schemes for each scripture type
export const scriptureColorSchemes: Record<string, ScriptureColorScheme> = {
  "금강경": { bg: "bg-[#21212F]", text: "text-white", progressBg: "#FF4D00" },
  "반야심경": { bg: "bg-[#EF4223]", text: "text-white", progressBg: "#FF9B21" },
  "법화경": { bg: "bg-[#0080FF]", text: "text-white", progressBg: "#0080FF" },
  "화엄경": { bg: "bg-[#FFB23F]", text: "text-white", progressBg: "#FFB23F" },
  "용수경": { bg: "bg-[#4CAF50]", text: "text-white", progressBg: "#4CAF50" },
  "육조단경": { bg: "bg-[#4CAF50]", text: "text-white", progressBg: "#4CAF50" },
};

// Calendar data
export const calendarData = [
  {
    date: new Date(2025, 3, 1),
    title: "금강경",
    completed: true,
    progress: 25.5
  },
  {
    date: new Date(2025, 3, 3),
    title: "반야심경",
    completed: true,
    progress: 87.8
  },
  {
    date: new Date(2025, 3, 4),
    title: "법화경",
    completed: false,
    progress: 0
  },
  {
    date: new Date(2025, 3, 7),
    title: "금강경",
    completed: false,
    progress: 0
  },
  {
    date: new Date(2025, 3, 8),
    title: "반야심경",
    completed: false,
    progress: 0
  }
];

// Reading history data
export const readingHistory = [
  {
    userId: 'user1',
    scripture: '금강경',
    date: '2025-04-08',
    time: '오후 2:53',
    progress: 25.5,
    description: '보현보살 행원품제행 함께하기',
    chapterId: 'ch1',
    pageIndex: 2
  },
  {
    userId: 'user1',
    scripture: '반야심경',
    date: '2025-04-09',
    time: '오전 9:15',
    progress: 87.8,
    description: '삼신불이 중생과 31마리의 물고기 발견하다',
    chapterId: 'ch2',
    pageIndex: 5
  },
  {
    userId: 'user1',
    scripture: '법화경',
    date: '2025-04-09',
    time: '오후 3:20',
    progress: 0,
    description: '삼신불이 중생과 28마리의 벌레 숨겨 두었다',
    chapterId: 'ch1',
    pageIndex: 1
  }
];

// Scriptures data with chapters
export const scriptures: Record<string, Scripture> = {
  '금강경': {
    id: 'diamond-sutra',
    title: '금강경',
    categories: ['금강경', '대승경전'],
    colorScheme: scriptureColorSchemes['금강경'],
    content: '如是我聞：一時佛在舍衛國祇樹給孤獨園，與大比丘衆千二百五十人俱...',
    chapters: [
      {
        id: 'ch1',
        title: '1. 개경 (開經)',
        original: '사시아문, 일시불제서왕사성, 기사굴산중, 여대비구증만이천인구...',
        explanation: '부처님과 수행자들이 모인 곳에서 시작된 가르침...'
      },
      {
        id: 'ch2',
        title: '2. 묘행무주분 (妙行無住分)',
        original: '시제수보리 재중작, 이종리석 이정업중 개협승기...',
        explanation: '수보리가 질문하고 부처님이 답하시는 금강경의 핵심...'
      },
      {
        id: 'ch3',
        title: '3. 대승정종분 (大乘正宗分)',
        original: '불고수보리 여여일체보살마하살 응여시항복기심...',
        explanation: '대승불교의 핵심 가르침에 대한 설명...'
      }
    ],
    hasStarted: true,
    lastReadPosition: 120,
    progress: 25.5,
    lastReadChapter: 'ch1',
    lastPageIndex: 2
  },
  '반야심경': {
    id: 'heart-sutra',
    title: '반야심경',
    categories: ['반야심', '대승경전'],
    colorScheme: scriptureColorSchemes['반야심경'],
    content: '관자재보살이 깊은 반야바라밀다를 행할 때 오온이 공함을 비추어 보고 일체의 고통에서 건지느니라...',
    chapters: [
      {
        id: 'ch1',
        title: '1. 개경 (開經)',
        original: '관자재보살이 깊은 반야바라밀다를 행할 때에 오온이 공함을 비추어 보고 온갖 괴로움에서 건지느니라.',
        explanation: '반야심경의 시작 부분으로, 관자재보살의 수행을 설명합니다.'
      },
      {
        id: 'ch2',
        title: '2. 색공분 (色空分)',
        original: '사리자여, 색(色)이 공(空)과 다르지 않고 공이 색과 다르지 않으니, 색이 곧 공이요 공이 곧 색이며, 수(受)·상(想)·행(行)·식(識)도 또한 그러하니라.',
        explanation: '불교의 핵심 개념인 색즉시공, 공즉시색에 대한 설명입니다.'
      },
      {
        id: 'ch3',
        title: '3. 진언분 (眞言分)',
        original: '그러므로 큰 신묘한 주문, 큰 밝은 주문, 가장 위없는 주문, 더없이 위없는 주문, 즉 반야바라밀다 주문은 이에 보이는 바와 같나니, 곧 가섭아 가섭아 바라가섭아 바라승가섭아 보리 사바하.',
        explanation: '반야심경의 마지막 부분으로, 진언(만트라)을 포함합니다.'
      }
    ],
    hasStarted: true,
    lastReadPosition: 50,
    progress: 87.8,
    lastReadChapter: 'ch2',
    lastPageIndex: 5
  },
  '법화경': {
    id: 'lotus-sutra',
    title: '법화경',
    categories: ['법화경', '대승경전'],
    colorScheme: scriptureColorSchemes['법화경'],
    content: '여시아문：일시불주왕사성기사굴산중，여대비구증만이천인구，개시아라한，제루이진...',
    chapters: [
      {
        id: 'ch1',
        title: '1. 서품 (序品)',
        original: '여시아문：일시불주왕사성기사굴산중，여대비구증만이천인구，개시아라한，제루이진...',
        explanation: '법화경의 시작 부분으로, 부처님이 설법하는 장면을 묘사합니다.'
      },
      {
        id: 'ch2',
        title: '2. 방편품 (方便品)',
        original: '이시세존종삼매안녕이출정，고문수사리법왕자...',
        explanation: '불교의 방편에 대한 설명으로, 부처님의 지혜를 강조합니다.'
      }
    ],
    hasStarted: false,
    progress: 0,
    lastReadChapter: '',
    lastPageIndex: 0
  }
};

// User bookmarks
export const bookmarks: Bookmark[] = [
  {
    id: 'bm1',
    userId: 'user1',
    scriptureId: 'diamond-sutra',
    chapterId: 'ch1',
    pageIndex: 2,
    title: '깨달음의 구절',
    note: '중요한 구절, 다시 읽기',
    createdAt: new Date('2025-03-20'),
    date: '2025-03-20'
  },
  {
    id: 'bm2',
    userId: 'user1',
    scriptureId: 'heart-sutra',
    chapterId: 'ch2',
    pageIndex: 3,
    title: '심경의 핵심',
    createdAt: new Date('2025-03-22'),
    date: '2025-03-22'
  }
];

// Reading schedule
export const readingSchedule = [
  {
    id: 1,
    scriptureId: 'diamond-sutra',
    title: '연기의 세계를 그린 거대한 불교 우주론',
    chapter: '제 1장 3절에서 이어보기',
    progress: 25.5
  },
  {
    id: 2,
    scriptureId: 'heart-sutra',
    title: '모든 고통에서 벗어나는 지혜의 핵심',
    chapter: '제 2장 1절에서 이어보기',
    progress: 87.8
  }
];

// Functions to interact with the data
export const getScriptureById = (id: string): Scripture | undefined => {
  return Object.values(scriptures).find(scripture => scripture.id === id);
};

export const getBookmarksByUserId = (userId: string): Bookmark[] => {
  return bookmarks.filter(bookmark => bookmark.userId === userId);
};

export const getUserReadingProgress = (userId: string, scriptureId: string) => {
  const scripture = getScriptureById(scriptureId);
  if (!scripture) return null;
  
  return {
    progress: scripture.progress || 0,
    lastReadChapter: scripture.lastReadChapter || '',
    lastPageIndex: scripture.lastPageIndex || 0
  };
};
