import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import BottomNav from "@/components/BottomNav";

export default function Profile(): JSX.Element {
  const profileData = {
    username: "뉴비301",
    profileImage: "", // 프로필 이미지 경로
  };

  // 페이지 접속 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[24px] pt-[42px] pb-[80px]">
          {/* Navigation Header */}
          <nav className="w-full h-[73px] flex items-center justify-center relative">
            <Button variant="ghost" size="icon" className="absolute left-6 top-6" aria-label="Back">
              <ArrowLeft className="w-[23px] h-[23px]" />
            </Button>
            <h1 className="font-bold text-[#2b2828] text-base tracking-[0.32px]">내 정보</h1>
          </nav>

          {/* Profile Section */}
          <Card className="w-[345px] mx-6 mt-[11px] border-none shadow-none">
            <CardContent className="p-0 flex items-center">
              <div className="relative">
                <Avatar className="w-[76px] h-[70px]">
                  <AvatarImage src={profileData.profileImage} alt="Profile" />
                  <AvatarFallback className="bg-[#e49b51]" />
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1 ml-2 flex justify-between items-center">
                <span className="font-extrabold text-black text-lg tracking-[0.36px] ml-2">
                  {profileData.username}
                </span>
                <ChevronRight className="w-2.5 h-[18px]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
