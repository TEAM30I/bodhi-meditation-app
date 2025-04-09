
// Interface for Scripture data model
export interface Scripture {
  id: string;
  title: string;
  content: string;
  categories: string[];
  chapters?: { title: string; content: string }[];
  hasStarted?: boolean;
  lastReadPosition?: number;
  progress?: number;
  colorScheme?: ScriptureColorScheme;
}

export interface ScriptureColorScheme {
  bg: string;
  text: string;
  progressBg: string;
}

// Interface for user's reading progress
export interface ReadingProgress {
  userId: string;
  scriptureId: string;
  lastReadPosition: number;
  completedChapters: string[];
  lastReadTimestamp: Date;
  progress: number;
}

// Interface for user's bookmarks
export interface Bookmark {
  id: string;
  userId: string;
  scriptureId: string;
  position: number;
  title: string;
  chapter?: string;
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

// Color scheme for each scripture type
export const scriptureColorSchemes: Record<string, ScriptureColorScheme> = {
  "금강경": { bg: "bg-[#21212F]", text: "text-white", progressBg: "#FF4D00" },
  "반야심경": { bg: "bg-[#EF4223]", text: "text-white", progressBg: "#FF9B21" },
  "법화경": { bg: "bg-[#0080FF]", text: "text-white", progressBg: "#0080FF" },
  "화엄경": { bg: "bg-[#FFB23F]", text: "text-white", progressBg: "#FFB23F" },
  "용수경": { bg: "bg-[#4CAF50]", text: "text-white", progressBg: "#4CAF50" },
  "육조단경": { bg: "bg-[#4CAF50]", text: "text-white", progressBg: "#4CAF50" },
  "반야심": { bg: "bg-[#EF4223]", text: "text-white", progressBg: "#FF9B21" },
};

// Calendar data for the scripture calendar
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

// Sample reading schedule data
export const readingSchedule = [
  {
    id: 1,
    category: '금강경',
    title: '연기의 세계를 그린 거대한 불교 우주론',
    chapter: '제 4권 3절에서 이어보기',
    colorScheme: scriptureColorSchemes['금강경'],
    progress: 25.5
  },
  {
    id: 2,
    category: '반야심경',
    title: '모든 고통에서 벗어나는 지혜의 핵심',
    chapter: '제 1권 4절에서 이어보기',
    colorScheme: scriptureColorSchemes['반야심경'],
    progress: 87.8
  },
  {
    id: 3,
    category: '법화경',
    title: '연민과 구원의 메시지를 전하는 보살의 경전',
    chapter: '제 1권 1절에서 시작하기',
    colorScheme: scriptureColorSchemes['법화경'],
    progress: 0
  }
];

// Reading History
export const readingHistory = [
  {
    userId: 'user1',
    scripture: '금강경',
    date: '2025-04-08',
    time: '오후 2:53',
    progress: 25.5,
    description: '보현보살 행원품제행 함께하기'
  },
  {
    userId: 'user1',
    scripture: '반야심경',
    date: '2025-04-09',
    time: '오전 9:15',
    progress: 87.8,
    description: '삼신불이 중생과 31마리의 물고기 발견하다'
  },
  {
    userId: 'user1',
    scripture: '법화경',
    date: '2025-04-09',
    time: '오후 3:20',
    progress: 0,
    description: '삼신불이 중생과 28마리의 벌레 숨겨 두었다'
  },
  {
    userId: 'user1',
    scripture: '화엄경',
    date: '2025-04-09',
    time: '오후 5:45',
    progress: 0,
    description: '삼신불이 중생과 108마리의 뱀과 마주치다'
  }
];

// Import the scriptureTexts separately to avoid circular dependencies
import { scriptureTexts } from './index';

// Sample scripture data - this needs to come after the import to avoid circular dependency
export const scriptures: Scripture[] = [
  {
    id: 'diamond-sutra',
    title: '금강경',
    categories: ['금강경', '대승경전'],
    content: scriptureTexts['금강경'].content,
    hasStarted: true,
    lastReadPosition: 120,
    progress: 25.5,
    colorScheme: scriptureColorSchemes['금강경']
  },
  {
    id: 'heart-sutra',
    title: '반야심경',
    categories: ['반야심', '대승경전'],
    content: scriptureTexts['반야심경'].content,
    hasStarted: true,
    lastReadPosition: 50,
    progress: 87.8,
    colorScheme: scriptureColorSchemes['반야심경']
  },
  {
    id: 'lotus-sutra',
    title: '법화경',
    categories: ['법화경', '대승경전'],
    content: '如是我聞：一時佛住王舍城耆闍崛山中，與大比丘衆萬二千人俱，皆是阿羅漢，諸漏已盡，無復煩惱，逮得己利，盡諸有結，心得自在。...',
    hasStarted: true,
    lastReadPosition: 250,
    progress: 0,
    colorScheme: scriptureColorSchemes['법화경']
  },
  {
    id: 'flower-ornament-sutra',
    title: '화엄경',
    categories: ['화엄경', '대승경전'],
    content: '여시아문, 일시불재보리수하..',
    hasStarted: false,
    progress: 0,
    colorScheme: scriptureColorSchemes['화엄경']
  },
  {
    id: 'sixth-patriarch-sutra',
    title: '육조단경',
    categories: ['육조단경', '대승경전'],
    content: '육조단경의 내용...',
    hasStarted: false,
    progress: 0,
    colorScheme: scriptureColorSchemes['육조단경']
  }
];

// Sample user bookmarks
export const bookmarks: Bookmark[] = [
  {
    id: 'bm1',
    userId: 'user1',
    scriptureId: 'diamond-sutra',
    position: 120,
    chapter: '개경 1장',
    title: '깨달음의 구절',
    note: '중요한 구절, 다시 읽기',
    createdAt: new Date('2025-03-20'),
    date: '2025-03-20'
  },
  {
    id: 'bm2',
    userId: 'user1',
    scriptureId: 'heart-sutra',
    position: 50,
    chapter: '개경 1장',
    title: '심경의 핵심',
    createdAt: new Date('2025-03-22'),
    date: '2025-03-22'
  },
  {
    id: 'bm3',
    userId: 'user1',
    scriptureId: 'diamond-sutra',
    position: 180,
    chapter: '개경 1장',
    title: '중요한 부분',
    createdAt: new Date('2025-04-05'),
    date: '2025-04-05'
  }
];
