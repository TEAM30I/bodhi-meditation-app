
import { 
  scriptures, 
  scriptureColorSchemes,
  readingHistory,
  calendarData,
  bookmarks,
  readingSchedule
} from '../public/data/scriptureData/scriptureRepository';

// Export types from scriptureRepository
export type { 
  Scripture, 
  ScriptureChapter,
  Bookmark,
  ScriptureColorScheme
} from '../public/data/scriptureData/scriptureRepository';

// Export all scripture data
export {
  scriptures,
  scriptureColorSchemes,
  readingHistory,
  calendarData,
  bookmarks,
  readingSchedule
};

// Function to get scripture by ID
export const getScriptureById = (id: string) => {
  return Object.values(scriptures).find(scripture => scripture.id === id);
};

// Function to get scripture by title
export const getScriptureByTitle = (title: string) => {
  return scriptures[title];
};

// Functions to update reading progress
export const updateReadingProgress = (scriptureId: string, progress: number, chapterId: string, pageIndex: number) => {
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
export const addBookmark = (userId: string, scriptureId: string, chapterId: string, pageIndex: number, title: string, note?: string) => {
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
