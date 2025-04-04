
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation, Search as SearchIcon } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { regionSearchRankings } from "@/data/searchRankingRepository";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();

  const handleRegionClick = (query: string) => {
    navigate(`/search-results?query=${query}`);
  };

  return (
    <PageLayout title="검색">
      {/* Tabs */}
      <Tabs defaultValue="temple" className="w-full max-w-full md:max-w-[80%] mx-auto h-11">
        <TabsList className="relative w-full max-w-[282px] md:max-w-[400px] h-[37px] bg-transparent p-0 gap-0 mx-auto">
          <TabsTrigger
            value="temple"
            className="w-[165px] md:w-[220px] h-[37px] bg-white rounded-[19.5px] shadow-[0px_1px_5px_#999999] font-semibold text-[#222222] text-xs tracking-[0.24px] leading-[15.6px] data-[state=active]:bg-white data-[state=active]:text-[#222222] data-[state=active]:shadow-[0px_1px_5px_#999999]"
          >
            사찰
          </TabsTrigger>
          <TabsTrigger
            value="templeStay"
            className="w-[117px] md:w-[180px] h-[37px] font-semibold text-[#8b8b8b] text-xs tracking-[0.24px] leading-[15.6px] data-[state=active]:bg-white data-[state=active]:text-[#222222] data-[state=active]:shadow-[0px_1px_5px_#999999]"
          >
            템플 스테이
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Input */}
      <div className="w-full max-w-[345px] md:max-w-[500px] lg:max-w-[600px] h-[46px] mx-auto my-8">
        <div className="relative w-full h-full bg-neutral-100 rounded-[10px] flex items-center">
          <SearchIcon className="absolute w-[21px] h-[21px] left-[13px]" />
          <Input
            className="h-full border-none bg-transparent pl-[43px] font-semibold text-[#999999] text-[15px] tracking-[0.45px] leading-[15px] focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            placeholder="지역, 지하철역, 사찰이름"
            onFocus={() => navigate('/search-results')}
          />
        </div>
      </div>

      {/* Location Search Button - Fixed spacing */}
      <div className="relative w-full max-w-[150px] mx-auto md:mx-auto mb-4">
        <Button
          variant="outline"
          className="w-full h-[31px] rounded-[14.5px] border border-solid border-[#dd773375] font-semibold text-[#dd7733] text-[13px] tracking-[0.39px] leading-[15px] flex items-center justify-center"
          onClick={() => navigate('/search-results?query=nearby')}
        >
          <Navigation className="w-[15px] h-[15px] mr-2" />
          <span className="whitespace-nowrap">내 주변에서 검색</span>
        </Button>
      </div>

      {/* Regional Search Ranking */}
      <h2 className="mx-6 my-6 font-bold text-black text-base tracking-[0] leading-[15px] whitespace-nowrap">
        지역 검색 순위
      </h2>

      {/* Ranked Locations List */}
      <div className="mx-6 flex flex-col gap-[42px]">
        {regionSearchRankings.map((location) => (
          <div
            key={location.id}
            className="font-normal text-black text-base leading-[15px] whitespace-nowrap cursor-pointer"
            onClick={() => handleRegionClick(location.query)}
          >
            <span className="font-bold tracking-[0] inline-block w-[60px]">
              {location.id}
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
