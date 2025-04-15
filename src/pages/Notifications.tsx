import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import PageLayout from "@/components/PageLayout";

interface NotificationItem {
  id: string;
  type: "템플스테이" | "사찰" | "전체";
  title: string;
  date: string;
  icon: React.ReactNode;
}

const notificationData: NotificationItem[] = [
  {
    id: "1",
    type: "템플스테이",
    title: "다가오는 2025-04-15일 봉기점 봉정사 사찰 체험이 되세요!",
    date: "2025.04.08",
    icon: (
      <div className="w-6 h-6 bg-[#FF8433] rounded-md flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3333 2.66667H13.3333C13.5101 2.66667 13.6797 2.73691 13.8047 2.86193C13.9298 2.98696 14 3.15652 14 3.33333V13.3333C14 13.5101 13.9298 13.6797 13.8047 13.8047C13.6797 13.9298 13.5101 14 13.3333 14H2.66667C2.48986 14 2.32029 13.9298 2.19526 13.8047C2.07024 13.6797 2 13.5101 2 13.3333V3.33333C2 3.15652 2.07024 2.98696 2.19526 2.86193C2.32029 2.73691 2.48986 2.66667 2.66667 2.66667H4.66667" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 1.33334H5.33333C5.14924 1.33334 5 1.48258 5 1.66667V3.66667C5 3.85077 5.14924 4.00001 5.33333 4.00001H10.6667C10.8507 4.00001 11 3.85077 11 3.66667V1.66667C11 1.48258 10.8507 1.33334 10.6667 1.33334Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33331 8H10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33331 10.6667H10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  },
  {
    id: "2",
    type: "사찰",
    title: "My 사찰로 등록한 '봉정사'에서 새로운 공지사항이 게재되었습니다!",
    date: "2025.04.08",
    icon: (
      <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14.6666C11.6819 14.6666 14.6667 11.6819 14.6667 7.99998C14.6667 4.31808 11.6819 1.33331 8 1.33331C4.3181 1.33331 1.33333 4.31808 1.33333 7.99998C1.33333 11.6819 4.3181 14.6666 8 14.6666Z" stroke="#777777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 5.33331V7.99998" stroke="#777777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 10.6667H8.00667" stroke="#777777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  },
  {
    id: "3",
    type: "템플스테이",
    title: "다가오는 2025-04-15일 봉기점 봉정사 사찰 체험이 되세요!",
    date: "2025.04.08",
    icon: (
      <div className="w-6 h-6 bg-[#FF8433] rounded-md flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3333 2.66667H13.3333C13.5101 2.66667 13.6797 2.73691 13.8047 2.86193C13.9298 2.98696 14 3.15652 14 3.33333V13.3333C14 13.5101 13.9298 13.6797 13.8047 13.8047C13.6797 13.9298 13.5101 14 13.3333 14H2.66667C2.48986 14 2.32029 13.9298 2.19526 13.8047C2.07024 13.6797 2 13.5101 2 13.3333V3.33333C2 3.15652 2.07024 2.98696 2.19526 2.86193C2.32029 2.73691 2.48986 2.66667 2.66667 2.66667H4.66667" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 1.33334H5.33333C5.14924 1.33334 5 1.48258 5 1.66667V3.66667C5 3.85077 5.14924 4.00001 5.33333 4.00001H10.6667C10.8507 4.00001 11 3.85077 11 3.66667V1.66667C11 1.48258 10.8507 1.33334 10.6667 1.33334Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33331 8H10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33331 10.6667H10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  },
  {
    id: "4",
    type: "템플스테이",
    title: "다가오는 2025-04-15일 봉기점 봉정사 사찰 체험이 되세요!",
    date: "2025.04.08",
    icon: (
      <div className="w-6 h-6 bg-[#FF8433] rounded-md flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3333 2.66667H13.3333C13.5101 2.66667 13.6797 2.73691 13.8047 2.86193C13.9298 2.98696 14 3.15652 14 3.33333V13.3333C14 13.5101 13.9298 13.6797 13.8047 13.8047C13.6797 13.9298 13.5101 14 13.3333 14H2.66667C2.48986 14 2.32029 13.9298 2.19526 13.8047C2.07024 13.6797 2 13.5101 2 13.3333V3.33333C2 3.15652 2.07024 2.98696 2.19526 2.86193C2.32029 2.73691 2.48986 2.66667 2.66667 2.66667H4.66667" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 1.33334H5.33333C5.14924 1.33334 5 1.48258 5 1.66667V3.66667C5 3.85077 5.14924 4.00001 5.33333 4.00001H10.6667C10.8507 4.00001 11 3.85077 11 3.66667V1.66667C11 1.48258 10.8507 1.33334 10.6667 1.33334Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33331 8H10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33331 10.6667H10.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"전체" | "템플스테이" | "사찰">("전체");

  const filteredNotifications = activeTab === "전체" 
    ? notificationData 
    : notificationData.filter(n => n.type === activeTab);

  return (
    <PageLayout>
      <div className="bg-[#F5F5F5] min-h-screen w-full pb-20">
        <div className="w-full max-w-[480px] mx-auto bg-white">
          {/* Header */}
          <div className="flex items-center h-[56px] px-5 border-b border-gray-200">
            <button
              onClick={() => navigate('/main')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center">알림</h1>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "전체" | "템플스테이" | "사찰")}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3 bg-transparent h-12">
                <TabsTrigger 
                  value="전체" 
                  className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                  ${activeTab === '전체' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
                >
                  전체
                </TabsTrigger>
                <TabsTrigger 
                  value="템플스테이" 
                  className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                  ${activeTab === '템플스테이' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
                >
                  템플스테이
                </TabsTrigger>
                <TabsTrigger 
                  value="사찰" 
                  className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                  ${activeTab === '사찰' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
                >
                  사찰
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Notifications List */}
          <div className="bg-white">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-start gap-3 p-4 border-b border-gray-100"
              >
                {notification.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${notification.type === '템플스테이' ? 'text-[#FF8433]' : 'text-[#888888]'}`}>
                      {notification.type}
                    </span>
                    <span className="text-xs text-gray-400">{notification.date}</span>
                  </div>
                  <p className="text-sm">{notification.title}</p>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="text-gray-500">알림이 존재하지 않습니다</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </PageLayout>
  );
}
