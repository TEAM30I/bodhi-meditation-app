import React from "react";
import { Bell, Home, ChevronLeft, ChevronRight } from "lucide-react";
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
      imageUrl: "/temple.png",
    },
    {
      name: "봉은사",
      location: "서울 강남구",
      imageUrl: "/temple.png",
    },
    {
      name: "불광사",
      location: "서울 은평구",
      imageUrl: "/temple.png",
    },
    {
      name: "불광사",
      location: "서울 송파구",
      imageUrl: "/temple.png",
    },
    {
      name: "불광사",
      location: "서울 송파구",
      imageUrl: "/temple.png",
    }
  ];

  return (
    <PageLayout title="마이페이지" showBackButton={true}>
      <div className="w-full max-w-[480px] mx-auto flex flex-col">
        <ProfileHeader
          username={profileData.username}
          profileImage={profileData.profileImage}
        />
        <SearchBar />
        
        <div className="mt-4 px-4">
          {temples.map((temple, index) => (
            <TempleItem
              key={index}
              {...temple}
              showButton={index === 0}
            />
          ))}
        </div>

        {/* Bottom Menu Items */}
        <div className="px-5 mt-6 space-y-4 mb-20">
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
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
    </PageLayout>
  );
}
