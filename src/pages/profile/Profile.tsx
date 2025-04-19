
import React from "react";
import { Bell, Home } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SearchBar from "@/components/profile/SearchBar";
import TempleItem from "@/components/profile/TempleItem";
import BottomNav from "@/components/BottomNav";

export default function Profile(): JSX.Element {
  const profileData = {
    username: "안녕하세요, Chris Bodhi님",
    profileImage: "", // 프로필 이미지 경로
  };

  const temples = [
    {
      name: "조계사",
      location: "서울 종로구",
      imageUrl: "/lovable-uploads/temple1.jpg",
    },
    {
      name: "봉은사",
      location: "서울 강남구",
      imageUrl: "/lovable-uploads/temple1.jpg",
    },
    {
      name: "불광사",
      location: "서울 은평구",
      imageUrl: "/lovable-uploads/temple1.jpg",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <button className="p-2" onClick={() => window.history.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">마이페이지</h1>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6" />
          <Home className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ProfileHeader
          username={profileData.username}
          profileImage={profileData.profileImage}
        />
        <SearchBar />
        
        <div className="mt-4">
          {temples.map((temple, index) => (
            <TempleItem
              key={index}
              {...temple}
              showButton={index === 0}
            />
          ))}
        </div>

        {/* Bottom Menu Items */}
        <div className="px-5 mt-6 space-y-4">
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700">리뷰 작성하기</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700">로그아웃</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="py-3">
            <span className="text-gray-500 text-sm">앱 버전 v1.2.3</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
