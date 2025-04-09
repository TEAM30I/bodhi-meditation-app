
// This file re-exports everything from the public/data folder to maintain backwards compatibility
// Export only what we need and avoid duplicate exports
export { scriptureTexts } from '../../../public/data/scriptureData';
export { 
  scriptureCategories,
  readingSchedule,
  bookmarks,
  scriptures,
  calendarData
} from '../../../public/data/scriptureData/scriptureRepository';

// Use "export type" for type declarations to fix TS1205 errors
export type { 
  Scripture,
  Bookmark,
  ReadingProgress
} from '../../../public/data/scriptureData/scriptureRepository';
