import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Search as SearchIcon, Star } from "lucide-react";
import React from "react";
import BottomNav from "@/components/BottomNav";

export default function Nearby(): JSX.Element {
  // Data for temple listing
  const templeData = {
    name: "법주사",
    location: "충북 보은군 · 속리산터미널에서 도보 10분",
    rating: 4.5,
    reviews: 22,
  };

  // Filter options
  const filterOptions = [
    { id: "temple", label: "사찰", active: true },
    { id: "templestay", label: "템플스테이", active: false },
  ];

  // Sort options
  const sortOptions = [
    { id: "recommended", label: "추천순", active: true },
    { id: "distance", label: "거리순", active: false },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen pb-[80px]">
      <div className="bg-white overflow-hidden w-[390px] relative">
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
        <div className="w-[392px] h-[771px] mt-10">
          {/* Map Image */}
          <div className="w-[390px] h-[433px] bg-gray-200">
            <img className="w-full h-full object-cover" alt="Map view" src="" />
          </div>

          {/* Temple List Card */}
          <Card className="w-[390px] h-[354px] mt-[-16px] rounded-[20px_20px_0px_0px] border-0 shadow-none">
            <CardContent className="p-0 relative h-full">
              {/* Pull indicator */}
              <div className="absolute w-[42px] h-[5px] top-1.5 left-[174px] bg-gray-300 rounded-full"></div>

              {/* Sort options */}
              <div className="inline-flex items-center gap-2.5 absolute top-[45px] left-[23px]">
                {sortOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant={option.active ? "default" : "secondary"}
                    className={`rounded-2xl px-[15px] py-1.5 text-xs font-semibold tracking-[0.24px] leading-5 ${
                      option.active
                        ? "bg-[#dd7733] hover:bg-[#c66a2e] text-white"
                        : "bg-neutral-100 text-black"
                    }`}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>

              <Separator className="absolute w-[390px] h-0.5 top-[91px] left-0" />

              {/* Temple count */}
              <div className="absolute top-[111px] left-3 font-bold text-[#222222] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                33개의 사찰
              </div>

              {/* Temple listing */}
              <div className="absolute w-[390px] h-[222px] top-[132px] left-0">
                {/* Temple image */}
                <div className="absolute w-[124px] h-[116px] top-[18px] left-6 bg-gray-300 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Temple image"
                    src=""
                  />
                </div>

                {/* Temple info */}
                <div className="flex flex-col w-[233px] h-[42px] items-start absolute top-6 left-[157px]">
                  <div className="relative self-stretch mt-[-1.00px] font-bold text-[#222222] text-base tracking-[-0.40px] leading-[22.4px]">
                    {templeData.name}
                  </div>

                  <div className="relative w-[251px] mb-[-19.00px] mr-[-18.18px] font-medium text-[#8b8b8b] text-sm tracking-[-0.35px] leading-[19.6px]">
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
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}