
// This file re-exports everything from the public/data folder to maintain backwards compatibility
// Import from public/data/scriptureData
import { 금강경 } from '../../../public/data/scriptureData/금강경';
import { 반야심경 } from '../../../public/data/scriptureData/반야심경';

// Create scriptureTexts object
export const scriptureTexts = {
  금강경,
  반야심경,
};

// Export other data from scriptureRepository
export { 
  scriptureCategories,
  readingSchedule,
  bookmarks,
  scriptures,
  calendarData,
  scriptureColorSchemes,
  readingHistory
} from '../../../public/data/scriptureData/scriptureRepository';

// Use "export type" for type declarations to fix TS1205 errors
export type { 
  Scripture,
  Bookmark,
  ReadingProgress,
  ScriptureColorScheme
} from '../../../public/data/scriptureData/scriptureRepository';
