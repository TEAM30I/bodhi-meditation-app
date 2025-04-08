
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import BottomNav from "@/components/BottomNav";

export default function Wishlist(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"temple" | "templestay">("temple");
  
  const tabsData = [
    { id: "temple", label: "사찰", count: 1 },
    { id: "templestay", label: "템플 스테이", count: 0 },
  ];

  const folderData = [
    { id: "default", name: "기본 폴더", count: 1, type: "사찰", image: "" },
  ];

  return (
    <PageLayout title="찜 목록">
      {/* Tabs */}
      <Tabs 
        defaultValue="temple" 
        className="w-full" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "temple" | "templestay")}
      >
        <TabsList className="flex justify-start h-auto bg-transparent p-0 mb-1">
          <TabsTrigger
            value="temple"
            className="font-bold text-[13px] tracking-[0.26px] leading-[16.9px] data-[state=active]:text-[#dd7733] data-[state=active]:bg-transparent data-[state=inactive]:text-[#8b8b8b] px-6 py-2"
          >
            사찰
          </TabsTrigger>
          <TabsTrigger
            value="templestay"
            className="font-semibold text-xs tracking-[0.24px] leading-[15.6px] data-[state=active]:text-[#dd7733] data-[state=active]:bg-transparent data-[state=inactive]:text-[#8b8b8b] px-6 py-2"
          >
            템플 스테이
          </TabsTrigger>
        </TabsList>

        {/* Tab Indicator */}
        <div className="relative">
          <Separator className="w-full h-px bg-[#e0e0e0]" />
          <div 
            className={`absolute top-0 h-[3px] bg-[#dd7733] transition-all duration-300 ${
              activeTab === "temple" ? "left-6 w-[72px]" : "left-[108px] w-[115px]"
            }`}
          />
        </div>

        <TabsContent value="temple" className="mt-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folderData.map((folder) => (
              <div key={folder.id} className="mb-4">
                <Card className="w-full md:w-[165px] h-[117px] bg-[#d9d9d9] rounded-[15px] border-none overflow-hidden">
                  <img src={folder.image} alt={folder.name} className="w-full h-full object-cover" />
                </Card>
                <h2 className="mt-3 font-bold text-[#2b2828] text-[15px] tracking-[0.30px] leading-[19.5px]">
                  {folder.name}
                </h2>
                <p className="font-medium text-[#999999] text-[13px] tracking-[0.26px] leading-[16.9px]">
                  {folder.type} {folder.count}개
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templestay" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">템플 스테이 찜한 내역이 없습니다.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Folder Button (고정 위치) */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
        <Button className="bg-[#dd7733] hover:bg-[#c66a2d] rounded-[50px] px-5 py-[15px]">
          <span className="font-semibold text-white text-sm tracking-[0.28px] leading-5">
            + 새 폴더
          </span>
        </Button>
      </div>
      
      <BottomNav />
    </PageLayout>
  );
}
