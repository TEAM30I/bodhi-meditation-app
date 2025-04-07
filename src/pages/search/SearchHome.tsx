
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { regionSearchRankings } from "@/data/searchRankingRepository";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SearchHome() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"temple" | "templeStay">("temple");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegionClick = (query: string) => {
    navigate(`/search-results?query=${query}&type=${activeTab}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${searchQuery}&type=${activeTab}`);
    } else {
      navigate(`/search-results?type=${activeTab}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white flex flex-col items-center min-h-screen w-full">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px]">
        {/* Header */}
        <div className="w-full h-[60px] flex items-center justify-center relative border-b border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4"
            onClick={() => navigate('/main')}
          >
            <ArrowLeft className="w-[20px] h-[20px]" />
          </Button>
          <h1 className="text-base font-bold">검색</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "temple" | "templeStay")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger 
                value="temple" 
                className={`py-2 text-sm ${activeTab === 'temple' ? 'text-bodhi-orange border-b-2 border-bodhi-orange' : 'text-gray-500'}`}
              >
                사찰
              </TabsTrigger>
              <TabsTrigger 
                value="templeStay" 
                className={`py-2 text-sm ${activeTab === 'templeStay' ? 'text-bodhi-orange border-b-2 border-bodhi-orange' : 'text-gray-500'}`}
              >
                템플스테이
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="w-full pl-9 py-2 bg-gray-100 border-none text-sm"
              placeholder="도시, 지역, 지하철역"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Location Search Button */}
        <div className="px-4 mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm border-bodhi-orange text-bodhi-orange hover:text-bodhi-orange hover:bg-orange-50 py-1 px-3 h-auto"
            onClick={() => navigate('/search-results?query=nearby&type=' + activeTab)}
          >
            <MapPin className="w-4 h-4" />
            <span>내 주변에서 검색</span>
          </Button>
        </div>

        {/* Regional Search Ranking */}
        <div className="px-4">
          <h2 className="text-base font-bold mb-4">
            {activeTab === 'temple' ? '지역 검색 순위' : '인기 검색어'}
          </h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {regionSearchRankings.map((location) => (
              <div
                key={location.id}
                className="flex items-center cursor-pointer"
                onClick={() => handleRegionClick(location.query)}
              >
                <span className="text-bodhi-orange font-bold w-6">{location.id}</span>
                <span className="font-medium">{location.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
