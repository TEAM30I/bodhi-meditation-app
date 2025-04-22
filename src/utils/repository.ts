
/**
 * Repository utility file
 * Re-exports all data repositories from /public/data to provide a consistent import path
 */

// Use relative paths to import from public/data directories
export * from '../../public/data/dataRepository';
export * from '../../public/data/templeData/templeRepository';
export * from '../../public/data/templeStayData/templeStayRepository';
export * from '../../public/data/scriptureData/scriptureRepository';
export * from '../../public/data/searchRankingRepository';
export * from '../../public/data/image/imageRepository';
