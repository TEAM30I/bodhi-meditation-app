import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ChevronRight, ChevronLeft } from "lucide-react";
import React from "react";
import PageLayout from "@/components/PageLayout";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Profile(): JSX.Element {
  const navigate = useNavigate();
  const profileData = {
    username: "뉴비301",
    profileImage: "", // 프로필 이미지 경로
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
            <h1 className="text-lg font-bold flex-1 text-center">내 정보</h1>
            <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>

        <div className="w-full max-w-[480px] mx-auto pb-20">
          <div className="px-6">
            {/* Profile Section */}
            <Card className="w-full border-none shadow-none">
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
      </div>
      <BottomNav />
    </PageLayout>
  );
}
