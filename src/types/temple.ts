
// Import types from public data repository instead of duplicating them
import { Temple as RepositoryTemple } from '/public/data/templeData/templeRepository';

// Re-export the type
export type Temple = RepositoryTemple;
