
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Search as SearchIcon, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { temples } from "@/data/templeRepository";

export default function FindTemple() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const locations = [
    { name: "서울", active: true },
    { name: "대구", active: false },
    { name: "부산", active: false },
    { name: "속초", active: false },
    { name: "인천", active: false },
    { name: "제주", active: false }
  ];

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
          <h1 className="text-base font-bold">사찰</h1>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4"
            onClick={() => navigate('/main')}
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="w-full pl-9 py-2 bg-gray-100 border-none text-sm"
              placeholder="도시, 지역, 지하철역"
              onFocus={() => navigate('/search-results')}
            />
          </div>
        </div>
        
        {/* Popular Temples Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">가까운 사찰</h2>
            <Button
              variant="ghost"
              className="text-xs text-gray-500 p-0 h-auto"
              onClick={() => {}}
            >
              더보기 &gt;
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {temples.slice(0, 2).map((temple) => (
              <div key={temple.id} className="cursor-pointer" onClick={() => navigate(`/temple/${temple.id}`)}>
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-bold">{temple.name}</h3>
                <p className="text-xs text-gray-500">{temple.location} · 숙산더디비에서 도보 10분</p>
              </div>
            ))}
          </div>
        </div>

        {/* Temple by Region Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">많이 찾는 사찰</h2>
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

          {/* Temple List */}
          <div className="grid grid-cols-2 gap-4">
            {temples.slice(0, 4).map((temple) => (
              <div key={temple.id} className="cursor-pointer" onClick={() => navigate(`/temple/${temple.id}`)}>
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden relative">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center">
                    <Star className="w-3 h-3 mr-0.5 text-black" />
                    <span className="text-xs font-bold">{temple.rating}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold">{temple.name}</h3>
                <p className="text-xs text-gray-500">{temple.location}</p>
                <p className="text-xs font-bold">봉정사 템플스테이<br />60,000원</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
