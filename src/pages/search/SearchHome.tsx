
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Search as SearchIcon, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { regionSearchRankings } from "../../data/searchRankingRepository";
import { allTemples, allTempleStays } from '../../data/dataRepository';
import BottomNav from '@/components/BottomNav';

export default function SearchHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"temple" | "templeStay">("templeStay");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-15~2025-04-16");
  const [selectedGuests, setSelectedGuests] = useState<string>("성인 1명");

  const handleRegionClick = (query: string) => {
    const path = activeTab === 'temple' 
      ? `/search/temple/results?query=${query}` 
      : `/search/temple-stay/results?query=${query}`;
    navigate(path);
  };

  const handleSearch = () => {
    const path = activeTab === 'temple'
      ? `/search/temple/results?query=${searchQuery || '서울'}`
      : `/search/temple-stay/results?query=${searchQuery || '서울'}`;
    navigate(path);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen w-full pb-20">
      <div className="w-full max-w-[480px] mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center h-[56px] px-5 border-b border-[#E5E5EC]">
          <button 
            onClick={() => navigate('/main')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center">검색</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E5E5EC]">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "temple" | "templeStay")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 bg-transparent h-12">
              <TabsTrigger 
                value="templeStay" 
                className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                ${activeTab === 'templeStay' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
              >
                템플스테이
              </TabsTrigger>
              <TabsTrigger 
                value="temple" 
                className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                ${activeTab === 'temple' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
              >
                사찰
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="w-full pl-9 py-2 bg-[#F5F5F5] border-none text-sm rounded-full"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Date and Guest Selection - Only for Temple Stay */}
        {activeTab === "templeStay" && (
          <div className="flex border-b border-[#E5E5EC] mb-4">
            <button className="flex items-center justify-between flex-1 px-4 py-3 border-r border-[#E5E5EC]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{selectedDate}</span>
              </div>
            </button>
            <button className="flex items-center justify-between flex-1 px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{selectedGuests}</span>
              </div>
            </button>
          </div>
        )}

        {/* Location Search Button */}
        <div className="px-4 mb-6">
          <button
            className="flex items-center gap-2 text-sm text-[#FF8433] border border-[#FF8433] rounded-full py-2 px-4"
            onClick={() => {
              const path = activeTab === 'temple'
                ? `/search/temple/results?query=nearby`
                : `/search/temple-stay/results?query=nearby`;
              navigate(path);
            }}
          >
            <MapPin className="w-4 h-4" />
            <span>내 주변에서 검색</span>
          </button>
        </div>

        {/* Regional Search Ranking */}
        <div className="px-4 mb-6">
          <h2 className="text-base font-bold mb-4 text-[#333333]">
            {activeTab === 'temple' ? '많이 찾는 사찰' : '인기 검색어'}
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {regionSearchRankings.map((location) => (
              <div
                key={location.id}
                className="flex items-center cursor-pointer"
                onClick={() => handleRegionClick(location.query)}
              >
                <span className="text-[#FF8433] font-bold w-6">{location.id}</span>
                <span className="font-medium">{location.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional info for Temple Stay tab */}
        {activeTab === 'templeStay' && (
          <div className="px-4 py-2 bg-[#F5F5F5]">
            <p className="text-xs text-gray-500">* 템플스테이는 예약 가능 일자와 인원을 선택해주세요.</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
