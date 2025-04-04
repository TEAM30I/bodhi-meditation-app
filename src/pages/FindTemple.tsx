
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Search } from 'lucide-react';
import PageLayout from "@/components/PageLayout";
import { useNavigate } from 'react-router-dom';

interface TempleCardProps {
  imageUrl: string;
  title: string;
  location: string;
  description: string;
  isFavorite?: boolean;
}

const TempleCard = ({ imageUrl, title, location, description, isFavorite = false }: TempleCardProps) => {
  return (
    <div className="relative w-full mb-6">
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

const FindTemple = () => {
  const navigate = useNavigate();
  
  const temples = [
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

  const locations = [
    { name: "전체", active: true },
    { name: "서울", active: false },
    { name: "경주", active: false },
    { name: "부산", active: false },
    { name: "전주", active: false },
    { name: "강원", active: false },
  ];

  const handleSearch = () => {
    navigate('/search-results?query=서울');
  };

  return (
    <PageLayout title="사찰 찾기">
      {/* Search Box */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            className="pl-10 bg-gray-100 border-0 focus-visible:ring-1 rounded-lg"
            placeholder="지역, 지하철역"
            onFocus={handleSearch}
          />
        </div>
      </div>

      {/* Location Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 mx-auto w-full max-w-md">
        {locations.map((location, index) => (
          <Badge
            key={index}
            variant={location.active ? "default" : "outline"}
            className={`px-3 py-1 rounded-full ${
              location.active ? "bg-[#dd7733] hover:bg-[#c66a2e]" : "border-gray-300"
            } whitespace-nowrap`}
          >
            {location.name}
          </Badge>
        ))}
      </div>

      {/* Temple Cards */}
      <div className="w-full max-w-md mx-auto">
        {temples.map((temple, index) => (
          <TempleCard 
            key={index}
            imageUrl={temple.imageUrl}
            title={temple.title}
            location={temple.location}
            description={temple.description}
            isFavorite={temple.isFavorite}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default FindTemple;
