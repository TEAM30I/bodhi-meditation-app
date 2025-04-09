
/// <reference types="vite/client" />

// Type declarations for all repositories

// imageRepository
declare module "*/imageRepository" {
  export const imageRepository: {
    templeBanner: {
      default: string;
    };
    logo: {
      default: string;
    };
  };
}

// searchRankingRepository
declare module "*/searchRankingRepository" {
  export interface SearchRanking {
    id: string;
    term: string;
    count: number;
    trend: 'up' | 'down' | 'new' | 'same';
  }
  
  export const regionSearchRankings: SearchRanking[];
  export const templeStaySearchRankings: SearchRanking[];
}

// templeRepository
declare module "*/templeRepository" {
  export interface NewsItem {
    id: string;
    temple: string;
    source: string;
    title: string;
    link: string;
    date: string;
  }
  
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
    facilities?: string[];
    nearbyAttractions?: string[];
    contact?: {
      phone?: string;
    };
    social?: {
      instagram?: string;
      facebook?: string;
    };
  }
  
  export const newsData: NewsItem[];
  export const nearbyTemples: Temple[];
  export const popularTemples: Temple[];
  export const temples: Record<string, Temple>;
  export const regionTags: { id: string; name: string; active: boolean }[];
  export const templeData: Temple[];
  
  export function getTempleList(): Temple[];
  export function getTopLikedTemples(limit?: number): Temple[];
  export function filterTemplesByTag(tag: string): Temple[];
  export function searchTemples(query: string): Temple[];
}

// templeStayRepository
declare module "*/templeStayRepository" {
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
    schedule: {
      time: string;
      activity: string;
    }[];
    tags?: string[];
  }
  
  export const templeStays: Record<string, TempleStay>;
  export const locations: { name: string; active: boolean }[];
  
  export function getTempleStayList(): TempleStay[];
  export function getTopLikedTempleStays(limit?: number): TempleStay[];
  export function searchTempleStays(query: string): TempleStay[];
  export function filterTempleStaysByTag(tag: string): TempleStay[];
}

// scriptureRepository
declare module "*/scriptureRepository" {
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

  export const scriptures: Record<string, Scripture>;
  export const scriptureCategories: { id: string; name: string; active: boolean }[];
  export const readingSchedule: ReadingScheduleItem[];
  export const bookmarks: Bookmark[];
  export const calendarData: { date: Date; title: string; completed: boolean; progress: number }[];
  
  export function getScriptureById(id: string): Scripture | undefined;
  export function updateReadingProgress(scriptureId: string, progress: number, chapterId: string, pageIndex: number): void;
  export function addBookmark(userId: string, scriptureId: string, chapterId: string, pageIndex: number, title: string): Bookmark;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
