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
    type: "가입축하",
    title: "BODHI에 오신 것을 환영합니다! 신규 가입을 축하드립니다.",
    date: "2025.05.10",
    icon: (
      <div className="w-6 h-6 bg-[#DE7834] rounded-md flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00004C14.6667 4.31814 11.6819 1.33337 8 1.33337C4.3181 1.33337 1.33333 4.31814 1.33333 8.00004C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33333 8.00004L7.33333 10.0L11.3333 6.00004" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  },
  {
    id: "2",
    type: "추천",
    title: "나에게 맞는 템플스테이와 사찰을 둘러보세요.",
    date: "2025.05.10",
    icon: (
      <div className="w-6 h-6 bg-[#8B5CF6] rounded-md flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.66667 10L8 11.3333L13.3333 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3333 8V12C13.3333 12.3536 13.1929 12.6928 12.9428 12.9428C12.6928 13.1929 12.3536 13.3333 12 13.3333H4.00001C3.64638 13.3333 3.30724 13.1929 3.0572 12.9428C2.80715 12.6928 2.66667 12.3536 2.66667 12V4.00001C2.66667 3.64638 2.80715 3.30724 3.0572 3.0572C3.30724 2.80715 3.64638 2.66667 4.00001 2.66667H10" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
      {/* <BottomNav /> */}
    </PageLayout>
  );
}
