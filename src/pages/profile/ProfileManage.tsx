
import React from "react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function ProfileManage() {
  const navigate = useNavigate();
  
  const profileData = {
    name: "Chris Bodhi",
    email: "bodh****@naver.com",
    id: "bodh****",
    phone: "010****5678",
    profileImage: "/lovable-uploads/b3351387-e0fa-4210-9edd-3de23637669d.png"
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <button className="p-2" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">내 정보 관리</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Profile Section */}
      <div className="px-6 py-8 flex flex-col items-center border-b border-gray-100">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileData.profileImage} />
            <AvatarFallback>CB</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-200">
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-xl font-bold">{profileData.name}</span>
          <Pencil className="w-4 h-4 ml-2 text-gray-500" />
        </div>
        <span className="text-gray-500 mt-1">{profileData.email}</span>
      </div>

      {/* Personal Info Section */}
      <div className="px-6 py-6">
        <h2 className="font-bold mb-4">개인정보</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">아이디</span>
            <span>{profileData.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">이메일</span>
            <span>{profileData.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">휴대폰번호</span>
            <span>{profileData.phone}</span>
          </div>
        </div>
      </div>

      {/* Membership Section */}
      <div className="px-6 mt-4">
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-700">회원탈퇴</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
