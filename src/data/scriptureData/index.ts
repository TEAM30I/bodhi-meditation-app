
// This file re-exports everything from the public/data folder to maintain backwards compatibility
// Import from public/data/scriptureData
import { 
  scriptureCategories,
  readingSchedule,
  bookmarks,
  scriptures,
  calendarData,
  scriptureColorSchemes,
  readingHistory
} from '../../../public/data/scriptureData/scriptureRepository';

import { scriptureTexts } from '../../../public/data/scriptureData';

// Export all data
export { 
  scriptureTexts,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  scriptures,
  calendarData,
  scriptureColorSchemes,
  readingHistory
};

// Use "export type" for type declarations to fix TS1205 errors
export type { 
  Scripture,
  Bookmark,
  ReadingProgress,
  ScriptureColorScheme
} from '../../../public/data/scriptureData/scriptureRepository';
