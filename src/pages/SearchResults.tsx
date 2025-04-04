
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Search } from 'lucide-react';
import PageLayout from "@/components/PageLayout";

interface SearchResultProps {
  imageUrl: string;
  title: string;
  location: string;
  description: string;
  isFavorite?: boolean;
}

const SearchResult = ({ imageUrl, title, location, description, isFavorite = false }: SearchResultProps) => {
  return (
    <div className="relative w-full mb-4">
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 bg-white/80 rounded-full h-8 w-8 p-0 flex items-center justify-center"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </Button>
        <div className="absolute bottom-3 left-3 bg-white/80 rounded px-2 py-1 flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-gray-600" />
          <span className="text-xs font-medium">{location}</span>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-700 mt-1">{description}</p>
      </div>
    </div>
  );
};

interface SearchResultsProps {
  query?: string;
}

const SearchResults = ({ query = '서울' }: SearchResultsProps) => {
  const results = [
    {
      imageUrl: "https://images.unsplash.com/photo-1526602367853-61a536f40855?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "천년의 숨 살아있는 고목을 거닐다",
      location: "Gyeongju",
      description: "경주의 아름다운 사찰과 함께하는 여행",
      isFavorite: true
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "마음까지 맑아지는 풍경 속으로",
      location: "Hapcheon",
      description: "합천의 전통 사찰에서 경험하는 힐링",
      isFavorite: false
    }
  ];

  return (
    <PageLayout title="사찰 찾기">
      {/* Search Box */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            className="pl-10 bg-gray-100 border-0 focus-visible:ring-1 rounded-lg"
            placeholder="지역, 지하철역"
            defaultValue={query}
          />
        </div>
      </div>

      {/* 추천순 Badge */}
      <div className="flex mb-6 mx-auto w-full max-w-md">
        <span className="text-sm text-gray-500">추천순</span>
      </div>

      {/* Results */}
      <div className="w-full max-w-md mx-auto">
        {results.map((result, index) => (
          <SearchResult 
            key={index}
            imageUrl={result.imageUrl}
            title={result.title}
            location={result.location}
            description={result.description}
            isFavorite={result.isFavorite}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default SearchResults;
