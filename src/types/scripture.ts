// Re-export Scripture types from repository
export * from '../../public/data/scriptureData/scriptureRepository';

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
