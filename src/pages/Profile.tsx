import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, ChevronRight, Signal, Wifi } from "lucide-react";
import React from "react";
import BottomNav from "@/components/BottomNav";

export default function Profile(): JSX.Element {
  // Status bar data
  const time = "9:41";

  // Profile data
  const profileData = {
    username: "뉴비301",
    profileImage: "", // Placeholder for the profile image
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen pb-[80px]">
      <div className="bg-white w-full max-w-[390px] relative">
        {/* Status Bar */}
        <header className="w-full h-[42px] px-5 py-2.5 flex justify-between items-center">
          <span className="font-medium text-black text-[17px] tracking-[0]">
            {time}
          </span>
          <div className="flex items-center gap-2">
            <Signal className="w-[19.2px] h-[12.23px]" />
            <Wifi className="w-[17.14px] h-[12.33px]" />
            <div className="relative w-[27.33px] h-[13px]">
              <div className="absolute w-[25px] h-[13px] top-0 left-0 rounded-[4.3px] border border-solid border-[#00000059]">
                <div className="relative w-[21px] h-[9px] top-px left-px bg-black rounded-[2.5px]" />
              </div>
              <div className="absolute w-px h-1 top-[5px] left-[26px] bg-[#00000059]" />
            </div>
          </div>
        </header>

        {/* Navigation Header */}
        <nav className="w-full h-[73px] flex items-center justify-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-6 top-6"
            aria-label="Back"
          >
            <ArrowLeft className="w-[23px] h-[23px]" />
          </Button>
          <h1 className="font-bold text-[#2b2828] text-base tracking-[0.32px]">
            내 정보
          </h1>
        </nav>

        {/* Profile Section */}
        <Card className="w-[345px] mx-6 mt-[11px] border-none shadow-none">
          <CardContent className="p-0 flex items-center">
            <div className="relative">
              <Avatar className="w-[76px] h-[70px]">
                <AvatarImage src={profileData.profileImage} alt="Profile" />
                <AvatarFallback className="bg-[#e49b51]"></AvatarFallback>
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

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}