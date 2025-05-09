// 잘못된 임포트 제거
// export * from '../../public/data/templeData/templeRepository';

export interface Temple {
  id: string;
  name: string;
  address: string;
  region: string;
  contact: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  latitude?: number;  // 추가
  longitude?: number; // 추가
  created_at?: string;
  updated_at?: string;
  follower_count?: number;
  search_count?: number;
  
  distance?: string;
  openingHours?: string;
  tags?: string[];
  direction?: string;
  websiteUrl?: string;
  likeCount?: number;
  facilities?: string[];
}

export type TempleSort = 'popular' | 'distance';

export interface RegionTag {
  id: string;
  name: string;
  active: boolean;
}
