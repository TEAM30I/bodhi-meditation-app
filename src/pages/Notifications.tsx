
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface NotificationItem {
  id: string;
  type: "템플스테이" | "사찰";
  title: string;
  date: string;
  icon: React.ReactNode;
}

export default function Notifications() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"전체" | "템플스테이" | "사찰">("전체");

  const notifications: NotificationItem[] = [
    {
      id: "1",
      type: "템플스테이",
      title: "다가오는 2025-04-15일 봉기점 봉정사 사찰 체험이 되세요!",
      date: "2025.04.08",
      icon: <Calendar className="w-8 h-8 text-bodhi-orange" />
    },
    {
      id: "2",
      type: "사찰",
      title: "My 사찰로 등록한 '봉정사'에서 새로운 공지사항이 게재되었습니다!",
      date: "2025.04.08",
      icon: <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
    },
    {
      id: "3",
      type: "템플스테이",
      title: "다가오는 2025-04-15일 봉기점 봉정사 사찰 체험이 되세요!",
      date: "2025.04.08",
      icon: <Calendar className="w-8 h-8 text-bodhi-orange" />
    },
    {
      id: "4",
      type: "템플스테이",
      title: "다가오는 2025-04-15일 봉기점 봉정사 사찰 체험이 되세요!",
      date: "2025.04.08",
      icon: <Calendar className="w-8 h-8 text-bodhi-orange" />
    }
  ];

  const filteredNotifications = activeTab === "전체" 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center relative h-[60px] border-b border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4"
            onClick={() => navigate('/main')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-base font-bold">알림</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "전체" | "템플스테이" | "사찰")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger 
                value="전체" 
                className={`py-2 text-sm ${activeTab === '전체' ? 'text-bodhi-orange border-b-2 border-bodhi-orange' : 'text-gray-500'}`}
              >
                전체
              </TabsTrigger>
              <TabsTrigger 
                value="템플스테이" 
                className={`py-2 text-sm ${activeTab === '템플스테이' ? 'text-bodhi-orange border-b-2 border-bodhi-orange' : 'text-gray-500'}`}
              >
                템플스테이
              </TabsTrigger>
              <TabsTrigger 
                value="사찰" 
                className={`py-2 text-sm ${activeTab === '사찰' ? 'text-bodhi-orange border-b-2 border-bodhi-orange' : 'text-gray-500'}`}
              >
                사찰
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notifications List */}
        <div className="p-4">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0"
            >
              {notification.icon}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold ${notification.type === '템플스테이' ? 'text-bodhi-orange' : 'text-bodhi-darkOrange'}`}>
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
  );
}
