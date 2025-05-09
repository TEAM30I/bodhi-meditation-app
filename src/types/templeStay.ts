export interface TempleStay {
  id: string;
  templeName: string;
  name?: string;
  temple_name?: string;
  location: string;
  imageUrl: string;
  price: number | string;
  description?: string;
  schedule?: Array<{
    time: string;
    activity: string;
    day?: number;
  }>;
  direction?: string;
  facilities?: string[];
  likeCount?: number;
  distance?: string;
  longitude?: number;
  latitude?: number;
  tags?: string[];
  duration?: string;
  websiteUrl?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  temple?: {
    id: string;
    name: string;
    region: string;
    address?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
  };
}

export type TempleStaySort = 'popular' | 'recent' | 'distance' | 'price_low' | 'price_high';
