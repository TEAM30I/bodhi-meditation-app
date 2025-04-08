
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ChevronRight } from "lucide-react";
import React from "react";
import PageLayout from "@/components/PageLayout";
import BottomNav from "@/components/BottomNav";

export default function Profile(): JSX.Element {
  const profileData = {
    username: "뉴비301",
    profileImage: "", // 프로필 이미지 경로
  };

  return (
    <PageLayout title="내 정보">
      {/* Profile Section */}
      <Card className="w-full mx-auto mt-[11px] border-none shadow-none">
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
      <BottomNav />
    </PageLayout>
  );
}
