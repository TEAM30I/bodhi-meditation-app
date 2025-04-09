
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Search, Calendar, Users, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/search/DateRangePicker';
import GuestSelector from '@/components/search/GuestSelector';

type RegionType = {
  name: string;
  active: boolean;
};

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openGuestSelector, setOpenGuestSelector] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string>("전체");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });
  const [guestCount, setGuestCount] = useState(2);

  // 정의된 지역 목록
  const regions: RegionType[] = [
    { name: "전체", active: true },
    { name: "서울/경기", active: false },
    { name: "강원", active: false },
    { name: "경상", active: false },
    { name: "전라", active: false },
    { name: "충청", active: false },
    { name: "제주", active: false }
  ];

  // 테마 필터
  const themes: RegionType[] = [
    { name: "전체", active: true },
    { name: "사찰 체험", active: false },
    { name: "명상", active: false },
    { name: "템플스테이", active: false },
    { name: "불교 문화", active: false }
  ];

  const handleSearch = () => {
    navigate('/search/temple-stay/results', { 
      state: { 
        query: searchQuery,
        dateRange,
        guestCount,
        region: activeRegion
      } 
    });
  };

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
          <h1 className="text-lg font-bold">템플스테이 찾기</h1>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 검색창 */}
        <div className="relative">
          <Input
            type="text"
            placeholder="템플스테이 이름을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 rounded-xl border-gray-300 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchQuery("")}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* 날짜 및 인원 선택 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-between font-normal text-gray-700 border-gray-300 py-6"
            onClick={() => setOpenDatePicker(true)}
          >
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{dateRange.from ? 
                `${dateRange.from.getMonth() + 1}/${dateRange.from.getDate()}` : 
                "체크인"} - {dateRange.to ? 
                `${dateRange.to.getMonth() + 1}/${dateRange.to.getDate()}` : 
                "체크아웃"}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 justify-between font-normal text-gray-700 border-gray-300 py-6"
            onClick={() => setOpenGuestSelector(true)}
          >
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>인원 {guestCount}명</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>

        {/* 지역 필터 */}
        <div>
          <h3 className="mb-3 font-medium">지역</h3>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region.name}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeRegion === region.name
                    ? "bg-black text-white" 
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
                onClick={() => setActiveRegion(region.name)}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* 테마 필터 */}
        <div>
          <h3 className="mb-3 font-medium">테마</h3>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name} 
                className={`px-4 py-2 rounded-full text-sm ${
                  theme.active 
                    ? "bg-black text-white" 
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 버튼 */}
        <Button 
          className="w-full bg-black hover:bg-gray-900 text-white py-6"
          onClick={handleSearch}
        >
          검색하기
        </Button>
      </div>

      {/* Date Picker Dialog */}
      <Dialog open={openDatePicker} onOpenChange={setOpenDatePicker}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <DateRangePicker 
            dateRange={dateRange}
            onChange={setDateRange}
            onClose={() => setOpenDatePicker(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Guest Selector Dialog */}
      <Dialog open={openGuestSelector} onOpenChange={setOpenGuestSelector}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <GuestSelector
            value={guestCount}
            onChange={setGuestCount}
            onClose={() => setOpenGuestSelector(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindTempleStay;
