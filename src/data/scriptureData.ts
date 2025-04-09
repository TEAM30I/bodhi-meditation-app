
import { 
  scriptures, 
  scriptureColorSchemes,
  readingHistory,
  calendarData,
  bookmarks,
  readingSchedule,
  Scripture,
  ScriptureChapter,
  Bookmark,
  ScriptureColorScheme,
  scriptureCategories
} from '../../public/data/scriptureData/scriptureRepository';

// Export types from scriptureRepository
export type { 
  Scripture, 
  ScriptureChapter,
  Bookmark,
  ScriptureColorScheme
};

// Export all scripture data
export {
  scriptures,
  scriptureColorSchemes,
  readingHistory,
  calendarData,
  bookmarks,
  readingSchedule,
  scriptureCategories
};

// Function to get scripture by ID
export const getScriptureById = (id: string): Scripture | undefined => {
  return Object.values(scriptures).find(scripture => scripture.id === id);
};

// Function to get scripture by title
export const getScriptureByTitle = (title: string): Scripture | undefined => {
  return scriptures[title];
};

// Functions to update reading progress
export const updateReadingProgress = (scriptureId: string, progress: number, chapterId: string, pageIndex: number): boolean => {
  const scripture = Object.values(scriptures).find(s => s.id === scriptureId);
  
  if (scripture) {
    scripture.progress = progress;
    scripture.lastReadChapter = chapterId;
    scripture.lastPageIndex = pageIndex;
    scripture.hasStarted = true;
    return true;
  }
  
  return false;
};

// Function to add bookmark
export const addBookmark = (userId: string, scriptureId: string, chapterId: string, pageIndex: number, title: string, note?: string): Bookmark => {
  const newBookmark = {
    id: `bm${bookmarks.length + 1}`,
    userId,
    scriptureId,
    chapterId,
    pageIndex,
    title,
    note,
    createdAt: new Date(),
    date: new Date().toISOString().split('T')[0]
  };
  
  bookmarks.push(newBookmark);
  return newBookmark;
};
