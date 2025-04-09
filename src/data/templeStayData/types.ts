
// Temple Stay type definitions

export interface TempleStay {
  id: string;
  templeName: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  likeCount: number;
  tags?: string[];
  facilities?: string[];
  program?: {
    schedule: {
      time: string;
      activity: string;
    }[];
  };
}
