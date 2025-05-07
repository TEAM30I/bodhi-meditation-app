// 경전 관련 타입 정의
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
  content?: any; // ScriptureContent 타입은 별도로 정의 필요
  chapters: ScriptureChapter[];
  progress?: number;
  hasStarted?: boolean;
  lastReadChapter?: string;
  lastPageIndex?: number;
}

// 추가 타입 정의
export interface ScriptureProgress {
  id: string;
  user_id: string;
  scripture_id: string;
  last_page: number;
  last_chapter_id: string;
  last_chapter_title?: string;
  progress: number;
  last_read_at: string;
  updated_at: string;
}
export interface CalendarItem {
  date: Date;
  scriptureId: string;
  progress: number;
  completed: boolean;
}