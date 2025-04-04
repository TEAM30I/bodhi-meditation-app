
export interface Temple {
  id: string;
  name: string;
  location: string;
  description?: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
}

export const temples: Temple[] = [
  {
    id: "bulguksa",
    name: "불국사",
    location: "경북 경주시",
    description: "천년의 역사를 간직한 고찰",
    rating: 4.8,
    reviews: 120,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "haeinsa",
    name: "해인사",
    location: "경남 합천군",
    description: "팔만대장경을 품은 사찰",
    rating: 4.7,
    reviews: 95,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "mireuksa",
    name: "미륵사",
    location: "전북 익산시",
    description: "백제 문화의 정수",
    rating: 4.6,
    reviews: 78,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "songgwangsa",
    name: "송광사",
    location: "전남 순천시",
    description: "승보사찰의 명성",
    rating: 4.7,
    reviews: 82,
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "beopjusa",
    name: "법주사",
    location: "충북 보은군",
    description: "속리산의 아름다운 사찰",
    rating: 4.5,
    reviews: 67,
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  }
];
