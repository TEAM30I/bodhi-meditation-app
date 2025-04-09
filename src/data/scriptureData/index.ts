
// This file re-exports everything from the public/data folder to maintain backwards compatibility
// Export only what we need and avoid duplicate exports
export { scriptureTexts } from '../../../public/data/scriptureData';
export { 
  Scripture,
  Bookmark,
  ReadingProgress,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  scriptures
} from '../../../public/data/scriptureData/scriptureRepository';
