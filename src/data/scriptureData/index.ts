
// This file re-exports everything from the public/data folder to maintain backwards compatibility
// Import from public/data/scriptureData
import { scriptureTexts } from '../../../public/data/scriptureData';

// Export scriptureTexts object
export { scriptureTexts };

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
