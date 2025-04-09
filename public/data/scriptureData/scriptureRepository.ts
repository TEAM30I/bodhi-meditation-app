
// Scripture data and utilities

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

// Example scriptures
export const scriptures: Record<string, Scripture> = {
  "diamond-sutra": {
    id: "diamond-sutra",
    title: "금강경",
    categories: ["대승경전"],
    colorScheme: {
      bg: "bg-[#DE7834]",
      text: "text-white",
      progressBg: "#DE7834"
    },
    content: "금강경 내용...",
    chapters: [
      {
        id: "chapter-1",
        title: "제1 법회인유분",
        original: "금강경 원문...",
        explanation: "금강경 해설..."
      }
    ],
    progress: 30,
    hasStarted: true,
    lastReadChapter: "chapter-1",
    lastPageIndex: 2
  },
  "heart-sutra": {
    id: "heart-sutra",
    title: "반야심경",
    categories: ["대승경전"],
    colorScheme: {
      bg: "bg-[#8B5CF6]",
      text: "text-white",
      progressBg: "#8B5CF6"
    },
    content: "반야심경 내용...",
    chapters: [
      {
        id: "chapter-1",
        title: "서분",
        original: "반야심경 원문...",
        explanation: "반야심경 해설..."
      }
    ],
    progress: 50,
    hasStarted: true,
    lastReadChapter: "chapter-1",
    lastPageIndex: 1
  }
};

export const scriptureCategories = [
  { id: "mahayana", name: "대승경전", active: true },
  { id: "hinayana", name: "소승경전", active: false },
  { id: "zen", name: "선종", active: false }
];

export const readingSchedule: ReadingScheduleItem[] = [
  {
    id: 1,
    scriptureId: "diamond-sutra",
    chapter: "제1 법회인유분",
    title: "법회의 인연",
    progress: 30
  },
  {
    id: 2,
    scriptureId: "heart-sutra",
    chapter: "서분",
    title: "반야바라밀다심경",
    progress: 50
  }
];

export const bookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    scriptureId: "diamond-sutra",
    chapterId: "chapter-1",
    pageIndex: 2,
    title: "금강경 첫 번째 북마크",
    date: "2025-04-01"
  },
  {
    id: "bookmark-2",
    scriptureId: "heart-sutra",
    chapterId: "chapter-1",
    pageIndex: 1,
    title: "반야심경 첫 번째 북마크",
    note: "중요한 구절",
    date: "2025-04-02"
  }
];

// Example calendar data with actual Date objects
export const calendarData = [
  {
    date: new Date(2025, 3, 7), // April 7, 2025
    title: "금강경",
    completed: true,
    progress: 30
  },
  {
    date: new Date(2025, 3, 8), // April 8, 2025
    title: "반야심경",
    completed: false,
    progress: 50
  },
  {
    date: new Date(2025, 3, 9), // April 9, 2025 (today)
    title: "법화경",
    completed: false,
    progress: 10
  }
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
    scriptures[scriptureId].lastReadChapter = chapterId;
    scriptures[scriptureId].lastPageIndex = pageIndex;
    scriptures[scriptureId].hasStarted = true;
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
    id: `bookmark-${Date.now()}`,
    scriptureId,
    chapterId,
    pageIndex,
    title,
    date: new Date().toISOString().split('T')[0]
  };
  
  bookmarks.push(newBookmark);
  return newBookmark;
}
