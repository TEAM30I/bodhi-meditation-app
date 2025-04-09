
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';

// Use relative import
import { calendarData } from '../../../public/data/scriptureData/scriptureRepository';

export const ScriptureCalendar = () => {
  const navigate = useNavigate();
  
  const typedCalendarData = typedData<typeof calendarData>(calendarData);
  
  // Get today's date and calculate the week
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Filter calendar data for the current month
  const thisMonthData = typedCalendarData.filter(item => {
    const itemMonth = item.date.getMonth();
    const itemYear = item.date.getFullYear();
    return itemMonth === currentMonth && itemYear === currentYear;
  });
  
  // Calculate progress
  const totalDays = thisMonthData.length;
  const completedDays = thisMonthData.filter(item => item.completed).length;
  const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  
  // Format today's date
  const formattedDate = `${currentYear}.${(currentMonth + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">캘린더</h2>
      
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">{currentYear}년 {currentMonth + 1}월</h3>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="absolute top-0 left-0 h-2 bg-[#DE7834] rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">이번 달 진행률: {progressPercentage.toFixed(1)}%</span>
          <span className="text-gray-500">{completedDays}/{totalDays} 완료</span>
        </div>
        
        <button
          className="w-full mt-4 py-2 bg-[#F5F5F5] rounded-lg text-sm text-center"
          onClick={() => navigate('/scripture/calendar')}
        >
          월간 캘린더 보기
        </button>
      </div>
      
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-base font-medium mb-3">오늘의 추천 경전</h3>
        
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-[#DE7834] mt-0.5" />
          <div>
            <p className="text-sm font-medium">법구경 제1품 쌍품</p>
            <p className="text-xs text-gray-500">8분 소요</p>
          </div>
        </div>
        
        <button
          className="w-full mt-4 py-2 bg-[#DE7834] text-white rounded-lg text-sm"
          onClick={() => navigate('/scripture/diamond-sutra')}
        >
          지금 읽기
        </button>
      </div>
    </div>
  );
};
