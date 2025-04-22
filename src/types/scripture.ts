
// Import types from public data repository instead of duplicating them
import { 
  Scripture as RepositoryScripture,
  ScriptureColorScheme as RepositoryScriptureColorScheme,
  Bookmark as RepositoryBookmark,
  ReadingProgress as RepositoryReadingProgress,
  ScriptureChapter as RepositoryScriptureChapter
} from '/public/data/scriptureData/scriptureRepository';

// Re-export the types
export type ScriptureColorScheme = RepositoryScriptureColorScheme;
export type ScriptureChapter = RepositoryScriptureChapter;
export type Bookmark = RepositoryBookmark;
export type ReadingProgress = RepositoryReadingProgress;
export type Scripture = RepositoryScripture;
