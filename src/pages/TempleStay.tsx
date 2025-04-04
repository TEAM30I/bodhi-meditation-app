
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  ChevronRight,
  Search as SearchIcon,
  Star,
  Users,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { locations, secondLocations, templeStays } from "@/data/templeStayRepository";

const TempleStay = (): JSX.Element => {
  return (
    <PageLayout title="템플스테이">
      {/* Search Card */}
      <Card className="w-full max-w-[368px] md:max-w-full h-auto mb-8 rounded-[20px] shadow-[0px_2px_2px_#d9d9d980,2px_0px_2px_#d9d9d980,0px_-2px_4px_#cacaca80] mx-auto">
        <CardContent className="p-6">
          {/* Search Input */}
          <div className="flex items-center mb-10">
            <SearchIcon className="w-[21px] h-[21px] text-gray-500" />
            <Input
              className="border-0 pl-2 font-semibold text-[#999999] text-[15px] tracking-[0.45px] leading-[15px] focus-visible:ring-0"
              placeholder="도시, 지역, 지하철역"
            />
          </div>

          {/* Date Selection */}
          <div className="flex items-center gap-3">
            <Calendar className="w-[15px] h-[15px]" />
            <span className="font-extrabold text-black text-[15px] tracking-[0] leading-[15px]">
              3.21 금 - 3.22 토
            </span>
          </div>

          {/* People Selection */}
          <div className="flex items-center gap-3 absolute top-20 right-6">
            <Users className="w-4 h-4" />
            <span className="font-extrabold text-black text-[15px] tracking-[0] leading-[15px]">
              인원 2
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Latest Temple Stay Section */}
      <div className="mt-[38px] px-0 md:px-6 w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[3px]">
            <h2 className="font-bold text-[#222222] text-lg tracking-[0] leading-6">
              최신 템플스테이
            </h2>
            <p className="font-medium text-[#222222] text-xs tracking-[0.24px] leading-6">
              3.21(금) - 3.22(토)
            </p>
          </div>

          <Button
            variant="ghost"
            className="flex items-center gap-1 p-0 h-auto"
          >
            <span className="font-bold text-[#8b8b8b] text-[13px] tracking-[-0.33px] leading-6">
              더보기
            </span>
            <ChevronRight className="w-6 h-6 text-[#8b8b8b]" />
          </Button>
        </div>

        {/* Location Filters */}
        <div className="flex items-center gap-2.5 mt-6 overflow-x-auto pb-2">
          {locations.map((location, index) => (
            <Badge
              key={index}
              variant={location.active ? "default" : "outline"}
              className={`px-[15px] py-1.5 rounded-2xl ${location.active ? "bg-[#dd7733] hover:bg-[#c66a2e]" : "border-[#e6e6e6]"}`}
            >
              <span className="font-semibold text-xs text-center tracking-[0.24px] leading-5">
                {location.name}
              </span>
            </Badge>
          ))}
        </div>

        {/* Temple Stay Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templeStays.map((stay) => (
            <div key={stay.id} className="relative">
              <div className="w-full h-[152px] bg-[#d9d9d9] rounded-[10px] relative overflow-hidden">
                <img src={stay.imageUrl} alt={stay.name} className="w-full h-full object-cover" />
                <Badge className="absolute bottom-1 left-2 bg-[#ffc83b] hover:bg-[#ffc83b] text-black px-[5px] py-[3px] rounded-[20px]">
                  <Star className="w-2.5 h-2.5 mr-1" />
                  <span className="font-extrabold text-[11px] tracking-[-0.28px] leading-[15px]">
                    {stay.rating}
                  </span>
                </Badge>
              </div>

              <div className="mt-2">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#8b8b8b] text-[10px] tracking-[-0.25px] leading-[15px]">
                    {stay.location}
                  </span>
                  <h3 className="font-bold text-[#222222] text-[13px] tracking-[0] leading-[normal]">
                    {stay.name}
                  </h3>
                  <p className="font-bold text-[#222222] text-sm tracking-[0] leading-[normal] mt-1">
                    {stay.price.toLocaleString()}원
                  </p>
                  <span className="font-medium text-[#8b8b8b] text-[10px] tracking-[0] leading-[10px]">
                    총 {stay.duration} (세금 포함)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temple Journey Section */}
      <div className="mt-12 px-0 md:px-6 w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="font-bold text-[#222222] text-[15px] tracking-[0] leading-6">
              지친 마음을 쉬게 하는 산사 여행
            </h2>
            <p className="font-medium text-[#222222] text-xs tracking-[0.24px] leading-6">
              3.21(금) - 3.22(토)
            </p>
          </div>

          <Button
            variant="ghost"
            className="flex items-center gap-1 p-0 h-auto"
          >
            <span className="font-bold text-[#8b8b8b] text-[13px] tracking-[-0.33px] leading-6">
              더보기
            </span>
            <ChevronRight className="w-6 h-6 text-[#8b8b8b]" />
          </Button>
        </div>

        {/* Second Location Filters */}
        <div className="flex items-center gap-2.5 mt-2 overflow-x-auto pb-2">
          {secondLocations.map((location, index) => (
            <Badge
              key={index}
              variant={location.active ? "default" : "outline"}
              className={`px-[15px] py-1.5 rounded-2xl ${location.active ? "bg-[#dd7733] hover:bg-[#c66a2e]" : "border-[#e6e6e6]"}`}
            >
              <span className="font-semibold text-xs text-center tracking-[0.24px] leading-5">
                {location.name}
              </span>
            </Badge>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TempleStay;
