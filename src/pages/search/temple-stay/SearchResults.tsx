
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import TempleStayItem from '@/components/search/TempleStayItem';
import { templeStays } from '@/data/templeStayData';
import GuestSelector from '@/components/search/GuestSelector';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = location.state || {};
  
  const [openFilter, setOpenFilter] = useState(false);
  const [guestCount, setGuestCount] = useState(queryParams.guestCount || 2);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState("추천순");

  // 정렬 옵션
  const sortOptions = ["추천순", "가격 낮은순", "평점 높은순", "리뷰 많은순"];
  
  // Display all temple stays if no search query provided, or apply filter
  const filteredStays = Object.values(templeStays).filter(stay => {
    if (queryParams.query) {
      return stay.name.includes(queryParams.query) || 
             stay.location?.includes(queryParams.query) ||
             stay.temple?.includes(queryParams.query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white w-full px-5 py-4 flex items-center border-b">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-medium">
            {queryParams.query ? `"${queryParams.query}" 검색 결과` : '모든 템플스테이'}
          </h1>
          <p className="text-sm text-gray-500">
            {filteredStays.length}개의 템플스테이
          </p>
        </div>
        <button 
          className="flex items-center gap-1 text-sm text-gray-600"
          onClick={() => setOpenFilter(true)}
        >
          <Filter size={18} />
          필터
        </button>
      </div>

      <div className="px-5 py-3 flex overflow-x-auto gap-2">
        {sortOptions.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
              sortBy === option
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setSortBy(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {filteredStays.length > 0 ? (
          filteredStays.map((stay) => (
            <TempleStayItem 
              key={stay.id}
              stay={stay}
              onClick={() => navigate(`/search/temple-stay/${stay.id}`)}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>검색 결과가 없습니다.</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              다시 검색하기
            </Button>
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog open={openFilter} onOpenChange={setOpenFilter}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">필터</h2>
            <button onClick={() => setOpenFilter(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="mb-3 font-medium">가격 범위</h3>
              <div className="mb-2">
                <Slider 
                  defaultValue={[0, 1000000]} 
                  max={1000000} 
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₩{priceRange[0].toLocaleString()}</span>
                <span>₩{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            
            {/* Guest Count */}
            <div>
              <h3 className="mb-3 font-medium">인원 수</h3>
              <GuestSelector 
                value={guestCount}
                onChange={setGuestCount}
              />
            </div>
            
            {/* Apply Button */}
            <Button 
              className="w-full bg-black hover:bg-gray-900"
              onClick={() => setOpenFilter(false)}
            >
              적용하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchResults;
