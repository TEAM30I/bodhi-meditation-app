import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FolderCard from "@/components/FolderCard";

export default function Wishlist(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"temple" | "templestay">("temple");
  const navigate = useNavigate();
  
  const tabsData = [
    { id: "temple", label: "사찰", count: 1 },
    { id: "templestay", label: "템플 스테이", count: 0 },
  ];

  const folderData = [
    { id: "default", name: "기본 폴더", count: 1, type: "사찰", image: "" },
  ];

  const handleFolderClick = (folderId: string) => {
    // 폴더 클릭 시 처리할 로직
    console.log(`Folder clicked: ${folderId}`);
    // 예: navigate(`/wishlist/folder/${folderId}`);
  };

  return (
    <PageLayout>
      <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
        <div className="w-full bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3 max-w-[480px] mx-auto">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center">찜 목록</h1>
            <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>

        <div className="w-full max-w-[480px] mx-auto pb-20">
          <div className="px-0">
            {/* Tabs */}
            <div className="flex justify-center items-center w-full">
              <button
                onClick={() => setActiveTab("temple")}
                className={`flex justify-center items-center flex-1 py-1.5 ${
                  activeTab === "temple" ? "text-[#dd7733] font-bold" : "text-[#8b8b8b]"
                }`}
              >
                사찰
              </button>
              <button
                onClick={() => setActiveTab("templestay")}
                className={`flex justify-center items-center flex-1 py-1.5 ${
                  activeTab === "templestay" ? "text-[#dd7733] font-bold" : "text-[#8b8b8b]"
                }`}
              >
                템플 스테이
              </button>
            </div>

            {/* Tab Indicator */}
            <div className="relative w-full">
              <Separator className="w-full h-px bg-[#e0e0e0]" />
              <div 
                className={`absolute top-0 h-[3px] bg-[#dd7733] transition-all duration-300 ${
                  activeTab === "temple" ? "left-0 w-1/2" : "left-1/2 w-1/2"
                }`}
              />
            </div>

            {/* Temple Tab Content */}
            {activeTab === "temple" && (
              <div className="mt-6 px-4">
                {folderData.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    id={folder.id}
                    name={folder.name}
                    count={folder.count}
                    type={folder.type}
                    image={folder.image}
                    onClick={() => handleFolderClick(folder.id)}
                  />
                ))}
              </div>
            )}

            {/* Templestay Tab Content */}
            {activeTab === "templestay" && (
              <div className="flex items-center justify-center h-40 mt-6 px-4">
                <p className="text-gray-500">템플 스테이 찜한 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
