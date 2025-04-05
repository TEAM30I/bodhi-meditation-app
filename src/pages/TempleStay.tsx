
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Home,
  Search as SearchIcon,
  Star,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { locations, secondLocations, templeStays } from "@/data/templeStayRepository";
import { useIsMobile } from "@/hooks/use-mobile";

const TempleStay = (): JSX.Element => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center relative h-[60px] border-b border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4"
            onClick={() => navigate('/main')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-base font-bold">템플스테이</h1>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4"
            onClick={() => navigate('/main')}
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="w-full pl-9 py-2 bg-gray-100 border-none text-sm"
              placeholder="도시, 지역, 지하철역"
            />
          </div>
        </div>

        {/* Date and People Selection */}
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 flex-1 mr-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-xs">3.21 금 - 3.2 토</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-xs">성인 2, 아동 0</span>
          </div>
        </div>

        {/* Latest Temple Stay Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold">최신 템플스테이</h2>
              <p className="text-xs text-gray-500">3.21(금) - 3.22(토)</p>
            </div>
            <Button
              variant="ghost"
              className="text-xs text-gray-500 p-0 h-auto"
              onClick={() => {}}
            >
              더보기 &gt;
            </Button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2">
            {locations.map((location, index) => (
              <Badge
                key={index}
                variant={location.active ? "default" : "outline"}
                className={`whitespace-nowrap ${location.active ? "bg-bodhi-orange hover:bg-bodhi-orange" : "text-gray-500"}`}
              >
                {location.name}
              </Badge>
            ))}
          </div>

          {/* Temple Stay List */}
          <div className="grid grid-cols-2 gap-4">
            {templeStays.slice(0, 2).map((stay) => (
              <div key={stay.id} className="cursor-pointer" onClick={() => navigate(`/temple-stay/${stay.id}`)}>
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden relative">
                  <img 
                    src={stay.imageUrl} 
                    alt={stay.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center">
                    <Star className="w-3 h-3 mr-0.5 text-black" />
                    <span className="text-xs font-bold">{stay.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stay.location}</p>
                <h3 className="text-sm font-bold">{stay.name}</h3>
                <p className="text-sm font-bold">{stay.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-500">총 {stay.duration} (세금 포함)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Temple Journey Section */}
        <div className="px-4 pb-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold">지친 마음을 쉬게 하는 산사 여행</h2>
              <p className="text-xs text-gray-500">3.21(금) - 3.22(토)</p>
            </div>
            <Button
              variant="ghost"
              className="text-xs text-gray-500 p-0 h-auto"
              onClick={() => {}}
            >
              더보기 &gt;
            </Button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2">
            {secondLocations.map((location, index) => (
              <Badge
                key={index}
                variant={location.active ? "default" : "outline"}
                className={`whitespace-nowrap ${location.active ? "bg-bodhi-orange hover:bg-bodhi-orange" : "text-gray-500"}`}
              >
                {location.name}
              </Badge>
            ))}
          </div>

          {/* Temple Stay List */}
          <div className="grid grid-cols-2 gap-4">
            {templeStays.slice(0, 2).map((stay) => (
              <div key={stay.id + '-2'} className="cursor-pointer" onClick={() => navigate(`/temple-stay/${stay.id}`)}>
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden relative">
                  <img 
                    src={stay.imageUrl} 
                    alt={stay.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center">
                    <Star className="w-3 h-3 mr-0.5 text-black" />
                    <span className="text-xs font-bold">{stay.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stay.location}</p>
                <h3 className="text-sm font-bold">{stay.name}</h3>
                <p className="text-sm font-bold">{stay.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-500">총 {stay.duration} (세금 포함)</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStay;
