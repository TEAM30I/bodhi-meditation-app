
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Search as SearchIcon, Star } from "lucide-react";
import React, { useEffect } from "react";
import BottomNav from "@/components/BottomNav";

export default function Nearby(): JSX.Element {
  const templeData = {
    name: "법주사",
    location: "충북 보은군 · 속리산터미널에서 도보 10분",
    rating: 4.5,
    reviews: 22,
  };

  const filterOptions = [
    { id: "temple", label: "사찰", active: true },
    { id: "templestay", label: "템플 스테이", active: false },
  ];

  const sortOptions = [
    { id: "recommended", label: "추천순", active: true },
    { id: "distance", label: "거리순", active: false },
  ];

  // 페이지 접속 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen pb-[80px]">
      <div className="bg-white overflow-hidden w-[390px] relative">
        {/* Status Bar */}
        <div className="w-[390px] h-[42px]">
          <div className="flex w-[390px] items-center justify-between px-5 py-2.5 relative">
            <div className="relative w-fit mt-[-1.00px] font-medium text-black text-[17px] text-center tracking-[0] leading-[22px] whitespace-nowrap">
              9:41
            </div>

            <div className="inline-flex items-end gap-2 relative flex-[0_0_auto]">
              {/* Signal icon placeholder */}
              <div className="relative w-[19.2px] h-[12.23px] bg-black opacity-80"></div>

              {/* WiFi icon placeholder */}
              <div className="relative w-[17.14px] h-[12.33px] bg-black opacity-80"></div>

              {/* Battery icon */}
              <div className="relative w-[27.33px] h-[13px]">
                <div className="absolute w-[25px] h-[13px] top-0 left-0 rounded-[4.3px] border border-solid border-[#00000059]">
                  <div className="relative w-[21px] h-[9px] top-px left-px bg-black rounded-[2.5px]" />
                </div>
                <div className="absolute w-px h-1 top-[5px] left-[26px] bg-black opacity-50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="w-[390px] h-[99px]">
          <div className="w-[390px] h-[73px]">
            <h1 className="text-center py-6 [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2b2828] text-base tracking-[0.32px]">
              주변
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="absolute w-[23px] h-[23px] top-6 left-6 p-0"
            >
              <ArrowLeft className="w-[23px] h-[23px]" />
            </Button>
          </div>

          <div className="w-[313px] h-[46px] mx-auto bg-neutral-100 rounded-[50px] flex items-center px-5">
            <SearchIcon className="w-[21px] h-[21px] text-gray-500 mr-4" />
            <Input
              className="border-0 bg-transparent h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#999999] placeholder:font-semibold text-[15px] tracking-[0.45px]"
              placeholder="지역, 지하철역"
            />
          </div>

          <div className="mt-4 mx-6 flex gap-3">
            {filterOptions.map((filter) => (
              <Badge
                key={filter.id}
                variant={filter.active ? "default" : "outline"}
                className={`rounded-2xl px-[15px] py-1.5 text-xs font-semibold tracking-[0.24px] leading-5 ${
                  filter.active
                    ? "bg-[#dd7733] hover:bg-[#c66a2e] text-white"
                    : "border-[#e6e6e6] text-black"
                }`}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Map and Temple List Section */}
        <div className="w-full mt-10">
          {/* Map Image */}
          <div className="w-full h-[433px] bg-gray-200">
            <img className="w-full h-full object-cover" alt="Map view" src="" />
          </div>

          {/* Temple List Card */}
          <Card className="w-full h-[354px] mt-[-16px] rounded-t-[20px] border-0 shadow-none">
            <CardContent className="p-0 relative h-full">
              {/* Pull Indicator */}
              <div className="absolute w-[42px] h-[5px] top-1.5 left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full"></div>

              {/* Sort Options */}
              <div className="inline-flex items-center gap-2.5 absolute top-[45px] left-[23px]">
                {sortOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant={option.active ? "default" : "secondary"}
                    className={`rounded-2xl px-[15px] py-1.5 text-xs font-semibold tracking-[0.24px] leading-5 ${
                      option.active ? "bg-[#dd7733] hover:bg-[#c66a2e] text-white" : "bg-neutral-100 text-black"
                    }`}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>

              <Separator className="absolute w-full h-0.5 top-[91px] left-0" />

              {/* Temple Count */}
              <div className="absolute top-[111px] left-3 font-bold text-[#222222] text-lg tracking-[0] leading-normal whitespace-nowrap">
                33개의 사찰
              </div>

              {/* Temple Listing */}
              <div className="absolute w-full h-[222px] top-[132px] left-0">
                {/* Temple Image */}
                <div className="absolute w-[124px] h-[116px] top-[18px] left-6 bg-gray-300 rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover" alt="Temple image" src="" />
                </div>
                {/* Temple Info */}
                <div className="flex flex-col w-[233px] h-[42px] items-start absolute top-6 left-[157px]">
                  <div className="font-bold text-[#222222] text-base tracking-[-0.40px] leading-[22.4px]">
                    {templeData.name}
                  </div>
                  <div className="font-medium text-[#8b8b8b] text-sm tracking-[-0.35px] leading-[19.6px]">
                    {templeData.location}
                  </div>
                </div>
                {/* Rating */}
                <div className="absolute w-[124px] h-10 top-[85px] left-[157px] flex items-center">
                  <Badge className="flex items-center gap-1 bg-[#ffc83b] text-black font-extrabold text-[11px] tracking-[-0.28px] leading-[15px] h-[21px] rounded-[20px] mr-2">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{templeData.rating}</span>
                  </Badge>
                  <div className="font-semibold text-[#8b8b8b] text-sm tracking-[-0.35px] leading-[19.6px] whitespace-nowrap">
                    {templeData.reviews}개의 평가
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
