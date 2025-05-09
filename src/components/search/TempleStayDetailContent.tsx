import React, { useState, useEffect } from 'react';
import { Heart, Share, CalendarClock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TempleStay } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { isTempleStayFollowed } from '@/lib/repository';

interface TempleStayDetailContentProps {
  templeStay: TempleStay;
  onGoToReservation: () => void;
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

const TempleStayDetailContent: React.FC<TempleStayDetailContentProps> = ({ 
  templeStay,
  onGoToReservation,
  isLiked = false,
  onLikeToggle
}) => {
  const { user } = useAuth();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLikeToggle) {
      onLikeToggle();
    }
  };

  const groupedSchedule = React.useMemo(() => {
    if (!templeStay.schedule || templeStay.schedule.length === 0) {
      return {};
    }

    return templeStay.schedule.reduce((acc, item) => {
      const day = item.day || 1;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {} as Record<number, typeof templeStay.schedule>);
  }, [templeStay.schedule]);

  const days = Object.keys(groupedSchedule).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* 프로그램 일정 */}
      <section>
        <h2 className="text-xl font-bold mb-4">프로그램 일정</h2>
        
        {templeStay.schedule && templeStay.schedule.length > 0 ? (
          days.length > 0 ? (
            <div className="space-y-6">
              {days.map(day => (
                <div key={day} className="space-y-3">
                  {days.length > 1 && (
                    <h3 className="font-medium text-lg text-gray-900">Day {day}</h3>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    {groupedSchedule[day]?.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 rounded-xl p-4 flex items-start hover:bg-gray-100 transition-colors"
                      >
                        <CalendarClock className="mr-3 h-5 w-5 text-[#DE7834] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-base text-gray-900">{item.time}</div>
                          <div className="text-gray-700 mt-1 leading-relaxed">{item.activity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">일정 정보가 없습니다.</p>
          )
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm text-center italic">일정 정보가 준비 중입니다.</p>
          </div>
        )}
      </section>

      {/* 프로그램 소개 */}
      <section>
        <h2 className="text-xl font-bold mb-3">프로그램 소개</h2>
        <p className="text-gray-700 leading-relaxed">
          {templeStay.description || '이 템플스테이는 자연 속에서 휴식과 명상을 즐길 수 있는 프로그램입니다.'}
        </p>
      </section>

      {/* 이용 요금 */}
      <section>
        <h2 className="text-xl font-bold mb-3">이용요금</h2>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-lg font-medium text-gray-900">
            성인 1인 {typeof templeStay.price === 'number' 
              ? templeStay.price.toLocaleString() 
              : parseInt(String(templeStay.price).replace(/[^\d]/g, '') || '0').toLocaleString()}원
          </p>
        </div>
      </section>

      {/* 유의사항 */}
      <section className="pb-32">
        <h2 className="text-xl font-bold mb-3">유의사항</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>프로그램 시작 10분 전에 도착해주세요.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>편안한 복장으로 참여해주세요.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>귀중품은 별도로 보관해주세요.</span>
          </li>
        </ul>
      </section>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex items-center justify-between max-w-[480px] mx-auto">
        <Button
          onClick={handleLikeClick}
          className="w-1/4 h-12 rounded-xl bg-[#DE7834] hover:bg-[#C26A2D] text-white flex flex-col items-center justify-center"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-white stroke-white' : 'stroke-white'}`} 
          />
          <span className="text-xs mt-1">{templeStay.likeCount || 0}</span>
        </Button>
        <Button
          onClick={onGoToReservation}
          className="w-3/4 ml-3 bg-[#DE7834] hover:bg-[#C26A2D] text-white h-12 rounded-xl font-medium"
        >
          예약하러 가기
        </Button>
      </div>
    </div>
  );
};

export default TempleStayDetailContent;
