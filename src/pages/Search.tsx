
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation, Search as SearchIcon } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function Search() {
  // Data for the ranked locations
  const rankedLocations = [
    { rank: 1, name: "경주" },
    { rank: 2, name: "서울" },
    { rank: 3, name: "대구" },
    { rank: 4, name: "속초" },
    { rank: 5, name: "제주" },
    { rank: 6, name: "강릉" },
    { rank: 7, name: "잠실" },
    { rank: 8, name: "인천" },
    { rank: 9, name: "경북 경주시" },
  ];

  return (
    <PageLayout title="검색">
      {/* Tabs */}
      <Tabs defaultValue="temple" className="w-full max-w-[338px] mx-auto h-11">
        <TabsList className="relative w-full max-w-[282px] h-[37px] bg-transparent p-0 gap-0 mx-auto">
          <TabsTrigger
            value="temple"
            className="w-[165px] h-[37px] bg-white rounded-[19.5px] shadow-[0px_1px_5px_#999999] font-semibold text-[#222222] text-xs tracking-[0.24px] leading-[15.6px] data-[state=active]:bg-white data-[state=active]:text-[#222222] data-[state=active]:shadow-[0px_1px_5px_#999999]"
          >
            사찰
          </TabsTrigger>
          <TabsTrigger
            value="templeStay"
            className="w-[117px] h-[37px] font-semibold text-[#8b8b8b] text-xs tracking-[0.24px] leading-[15.6px] data-[state=active]:bg-white data-[state=active]:text-[#222222] data-[state=active]:shadow-[0px_1px_5px_#999999]"
          >
            템플 스테이
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Input */}
      <div className="w-full max-w-[345px] h-[46px] mx-auto my-8">
        <div className="relative w-full h-full bg-neutral-100 rounded-[10px] flex items-center">
          <SearchIcon className="absolute w-[21px] h-[21px] left-[13px]" />
          <Input
            className="h-full border-none bg-transparent pl-[43px] font-semibold text-[#999999] text-[15px] tracking-[0.45px] leading-[15px] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="지역, 지하철역, 사찰이름"
          />
        </div>
      </div>

      {/* Location Search Button - Fixed the positioning */}
      <div className="relative w-full max-w-[135px] mx-auto md:mx-6">
        <Button
          variant="outline"
          className="w-full h-[31px] rounded-[14.5px] border border-solid border-[#dd773375] font-semibold text-[#dd7733] text-[13px] tracking-[0.39px] leading-[15px] flex items-center justify-center relative pl-[30px]"
        >
          <Navigation className="absolute left-[9px] w-[21px] h-[21px]" />
          <span className="whitespace-nowrap">내 주변에서 검색</span>
        </Button>
      </div>

      {/* Regional Search Ranking */}
      <h2 className="mx-6 my-6 font-bold text-black text-base tracking-[0] leading-[15px] whitespace-nowrap">
        지역 검색 순위
      </h2>

      {/* Ranked Locations List */}
      <div className="mx-6 flex flex-col gap-[42px]">
        {rankedLocations.map((location) => (
          <div
            key={location.rank}
            className="font-normal text-black text-base leading-[15px] whitespace-nowrap"
          >
            <span className="font-bold tracking-[0] inline-block w-[60px]">
              {location.rank}
            </span>
            <span className="font-medium tracking-[-0.06px]">
              {location.name}
            </span>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
