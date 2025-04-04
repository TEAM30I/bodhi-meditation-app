import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import BottomNav from "@/components/BottomNav";

export default function Wishlist(): JSX.Element {
  const tabsData = [
    { id: "temple", label: "사찰", count: 1 },
    { id: "templestay", label: "템플 스테이", count: 0 },
  ];

  const folderData = [
    { id: "default", name: "기본 폴더", count: 1, type: "사찰", image: "" },
  ];

  // 페이지 접속 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[24px] pt-[42px] pb-[80px]">
          {/* Header */}
          <div className="w-full">
            <div className="relative pt-6 pb-4">
              <h1 className="text-center [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2b2828] text-base tracking-[0.32px] leading-[20.8px]">
                찜 목록
              </h1>
              <Button variant="ghost" size="icon" className="absolute top-6 left-6 p-0 h-[23px] w-[23px]">
                <ArrowLeft className="h-[23px] w-[23px]" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="temple" className="w-full">
              <TabsList className="flex justify-start h-auto bg-transparent p-0 mb-1">
                <TabsTrigger
                  value="temple"
                  className="[font-family:'Pretendard-Bold',Helvetica] font-bold text-[13px] tracking-[0.26px] leading-[16.9px] data-[state=active]:text-[#dd7733] data-[state=active]:bg-transparent data-[state=inactive]:text-[#8b8b8b] px-6 py-2"
                >
                  사찰
                </TabsTrigger>
                <TabsTrigger
                  value="templestay"
                  className="[font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-xs tracking-[0.24px] leading-[15.6px] data-[state=active]:text-[#dd7733] data-[state=active]:bg-transparent data-[state=inactive]:text-[#8b8b8b] px-6 py-2"
                >
                  템플 스테이
                </TabsTrigger>
              </TabsList>

              {/* Tab Indicator */}
              <div className="relative">
                <Separator className="w-full h-px bg-[#e0e0e0]" />
                <div className="absolute top-0 left-6 w-[183px] h-[3px] bg-[#dd7733]" />
              </div>

              <TabsContent value="temple" className="mt-6 px-6">
                {folderData.map((folder) => (
                  <div key={folder.id} className="mb-4">
                    <Card className="w-[165px] h-[117px] bg-[#d9d9d9] rounded-[15px] border-none overflow-hidden">
                      <img src={folder.image} alt={folder.name} className="w-full h-full object-cover" />
                    </Card>
                    <h2 className="mt-3 [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2b2828] text-[15px] tracking-[0.30px] leading-[19.5px]">
                      {folder.name}
                    </h2>
                    <p className="[font-family:'Pretendard-Medium',Helvetica] font-medium text-[#999999] text-[13px] tracking-[0.26px] leading-[16.9px]">
                      {folder.type} {folder.count}개
                    </p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="templestay" className="mt-6">
                {/* 템플 스테이 탭 콘텐츠 */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* New Folder Button (고정 위치) */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
        <Button className="bg-[#dd7733] hover:bg-[#c66a2d] rounded-[50px] px-5 py-[15px]">
          <span className="[font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[0.28px] leading-5">
            + 새 폴더
          </span>
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
