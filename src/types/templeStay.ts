
export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  imageUrl: string;
  price: number;
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
  // Add these missing properties
  tags?: string[];
  duration?: string;
  websiteUrl?: string;
}
