
import { Scripture, ScriptureColorScheme, Bookmark, ReadingProgress } from "@/types/scripture";

// Dummy data for Scripture-related features
export const scriptures: Record<string, Scripture> = {};
export const scriptureCategories = [];
export const readingSchedule = [
  {
    id: 1,
    scriptureId: "script1",
    chapter: "Chapter 1",
    title: "불교 입문",
    progress: 0
  },
  {
    id: 2,
    scriptureId: "script2",
    chapter: "Chapter 1",
    title: "명상의 기초",
    progress: 0
  },
  {
    id: 3,
    scriptureId: "script3",
    chapter: "Chapter 1",
    title: "깨달음의 길",
    progress: 0
  }
];

export const bookmarks: Bookmark[] = [];
export const calendarData = [];

export const getScriptureById = (id: string): Scripture | undefined => {
  console.log(`getScriptureById called for id: ${id}`);
  return undefined;
};

export const updateReadingProgress = (
  scriptureId: string, 
  progress: number, 
  chapterId: string, 
  pageIndex: number
): void => {
  console.log(`updateReadingProgress called for scriptureId: ${scriptureId}`);
};

export const addBookmark = (
  userId: string, 
  scriptureId: string, 
  chapterId: string, 
  pageIndex: number, 
  title: string
): Bookmark => {
  console.log(`addBookmark called for scriptureId: ${scriptureId}`);
  return {
    id: 'temp-id',
    scriptureId,
    chapterId,
    pageIndex,
    title,
    date: new Date().toISOString()
  };
};
