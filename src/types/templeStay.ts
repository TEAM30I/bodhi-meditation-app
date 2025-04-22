
// Import types from public data repository instead of duplicating them
import { TempleStay as RepositoryTempleStay } from '/public/data/templeStayData/templeStayRepository';

// Re-export the type
export type TempleStay = RepositoryTempleStay;
