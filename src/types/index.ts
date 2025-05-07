// 모든 타입 재내보내기
export * from './temple';
export * from './templeStay';
export * from './scripture';

// 사찰 관련 타입
export interface Temple {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  distance?: string;
  description?: string;
  openingHours?: string;
  tags?: string[];
  direction?: string;
  websiteUrl?: string;
  likeCount?: number;
  facilities?: string[];
  contact?: {
    phone?: string;
  };
  latitude?: number;
  longitude?: number;
}

export type TempleSort = 'popular' | 'recent' | 'distance';

export interface RegionTag {
  id: string;
  name: string;
  active: boolean;
}

// 경전 관련 타입
export interface Scripture {
  id: string;
  title: string;
  category: string;
  content: string;
  // 기타 필요한 필드
}

// 기타 필요한 타입들...
