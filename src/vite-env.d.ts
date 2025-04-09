
/// <reference types="vite/client" />

// Type declarations for data from public directory
declare module '/public/data/imageRepository' {
  export const imageRepository: {
    templeBanner: {
      default: string;
    };
    logo: {
      default: string;
    };
  };
}

declare module '/public/data/searchRankingRepository' {
  export interface SearchRanking {
    id: string;
    term: string;
    count: number;
    trend: 'up' | 'down' | 'new' | 'same';
  }
  
  export const regionSearchRankings: SearchRanking[];
  export const templeStaySearchRankings: SearchRanking[];
}

declare module '/public/data/templeData/templeRepository' {
  export interface Temple {
    id: string;
    name: string;
    location: string;
    imageUrl: string;
    distance?: string;
    rating?: number;
    reviews?: number;
    description?: string;
    openingHours?: string;
    tags?: string[];
    hasParkingLot?: boolean;
    hasTempleStay?: boolean;
    direction?: string;
    websiteUrl?: string;
    likeCount?: number;
  }
  
  export const temples: Record<string, Temple>;
  export const nearbyTemples: Temple[];
  export const regionTags: { id: string; name: string; active: boolean }[];
  
  export function getTempleList(): Temple[];
  export function searchTemples(query: string): Temple[];
}

declare module '/public/data/templeStayData/templeStayRepository' {
  export interface TempleStay {
    id: string;
    templeName: string;
    location: string;
    direction: string;
    price: number;
    likeCount: number;
    description: string;
    duration: string;
    imageUrl: string;
    websiteUrl: string;
  }
  
  export const templeStays: Record<string, TempleStay>;
  export const locations: { name: string; active: boolean }[];
  
  export function getTempleStayList(): TempleStay[];
  export function searchTempleStays(query: string): TempleStay[];
}

declare module '/public/data/scriptureData/scriptureRepository' {
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

  export const scriptures: Record<string, Scripture>;
  export const readingSchedule: ReadingScheduleItem[];
  export const bookmarks: Bookmark[];
  export const calendarData: { date: Date; title: string; completed: boolean; progress: number }[];
  
  export function getScriptureById(id: string): Scripture | undefined;
  export function updateReadingProgress(scriptureId: string, progress: number, chapterId: string, pageIndex: number): void;
  export function addBookmark(userId: string, scriptureId: string, chapterId: string, pageIndex: number, title: string): Bookmark;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
