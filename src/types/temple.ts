// Re-export Temple type from repository
export * from '../../public/data/templeData/templeRepository';

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
