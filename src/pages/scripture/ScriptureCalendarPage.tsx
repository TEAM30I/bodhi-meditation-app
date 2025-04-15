
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { calendarData, readingSchedule, scriptures } from '../../../public/data/scriptureData/scriptureRepository';

const ScriptureCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const typedCalendarData = typedData<typeof calendarData>(calendarData);
  const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const prevMonthDays = [];
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push(daysInPrevMonth - firstDayOfMonth + i + 1);
  }
  
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  const nextMonthDays = [];
  const totalCells = 42;
  const remainingCells = totalCells - (prevMonthDays.length + days.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(i);
  }
  
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const getReadingDataForDate = (date: number) => {
    const fullDate = new Date(year, month, date);
    const matchingData = typedCalendarData.find(item => 
      item.date.getFullYear() === fullDate.getFullYear() &&
      item.date.getMonth() === fullDate.getMonth() &&
      item.date.getDate() === fullDate.getDate()
    );
    
    return matchingData;
  };
  
  const readingItems = typedReadingSchedule.slice(0, 2).map(schedule => {
    const matchingScripture = Object.values(typedScriptures).find(s => s.id === schedule.scriptureId);
    if (!matchingScripture) return null;
    
    return {
      id: schedule.id,
      title: matchingScripture.title,
      color: matchingScripture.id === 'heart-sutra' ? '#EF4223' :
             matchingScripture.id === 'diamond-sutra' ? '#21212F' :
             matchingScripture.id === 'lotus-sutra' ? '#0080FF' : '#DE7834',
      progress: matchingScripture.progress || 0
    };
  }).filter(Boolean);
  
  const getDayClass = (day: number) => {
    const isToday = day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();
                    
    const hasReading = !!getReadingDataForDate(day);
    
    if (isToday) return "bg-[#DE7834] text-white";
    if (hasReading) return "bg-[#FFD0B0] text-[#111]";
    
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0) return "text-[#E30000]"; // Sunday
    
    return "text-[#111]";
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen">

      <div className="sticky top-[44px] z-10 bg-white w-full h-[56px] flex items-center px-5">
        <button 
          onClick={() => navigate('/scripture')}
          className="mr-4"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-[20px] font-bold">경전 읽기 캘린더</h1>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-[32px] p-4 shadow-sm mb-8">
          <div className="flex justify-between items-center px-[10px] py-[10px]">
            <button onClick={goToPrevMonth}>
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-base font-bold">
              {year}년 {monthNames[month]}
            </h2>
            <button onClick={goToNextMonth}>
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 text-center">
            {weekdays.map((day, index) => (
              <div 
                key={`weekday-${index}`} 
                className={`py-[14px] text-xs ${index === 0 ? 'text-[#767676]' : 'text-[#767676]'}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 text-center">
            {prevMonthDays.map((day, index) => (
              <div 
                key={`prev-${index}`} 
                className="py-[14px] text-xs text-[#767676]"
              >
                {day}
              </div>
            ))}
            
            {days.map((day) => (
              <div 
                key={`current-${day}`} 
                className={`py-[14px] text-xs ${getDayClass(day)} ${getReadingDataForDate(day) ? 'rounded-full' : ''}`}
              >
                {day}
              </div>
            ))}
            
            {nextMonthDays.map((day, index) => (
              <div 
                key={`next-${index}`} 
                className="py-[14px] text-xs text-[#767676]"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 mb-6">
          <h2 className="text-[20px] font-bold pb-3">현재 진행 중</h2>
          
          {readingItems.map((item, index) => (
            <div key={`reading-${index}`} className="bg-white rounded-[32px] p-5 shadow-sm mb-4">
              <div 
                className="inline-flex px-2 py-2 rounded-xl mb-3"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-xs text-white">
                  {item.title}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-4">
                보리11님의 {item.title} 통독
              </h3>
              <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-2">
                <div 
                  className="h-1 rounded-full"
                  style={{ 
                    width: `${item.progress}%`,
                    background: `linear-gradient(90deg, rgba(218, 0, 0, 0.55) 0%, ${item.color} 44.19%)`
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  이 달의 진행률: <span className="text-[#DE7834] font-bold">{(item.progress / 10).toFixed(1)}%</span>
                  {index === 0 ? ' 9일 동안 경전을 읽었어요' : ' 17일 동안 경전을 읽었어요'}
                </span>
                <span className="text-xs text-gray-500">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-[20px] font-bold mb-3">나의 경전 여정</h2>
          
          <div className="bg-white rounded-[24px] p-5 shadow-sm flex items-center justify-between mb-4">
            <span className="text-base text-[#767676]">기록 데이터가 없어요</span>
            <Calendar size={24} className="text-[#767676]" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={`journey-${item}`} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F1F1F5]"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#505050]">
                    {item % 2 === 0 ? '김시훈님이 반야심경 24페이지를 읽었어요' : '김시훈님이 화엄경 31페이지를 읽었어요'}
                  </p>
                  <p className="text-xs text-gray-500">2025.04.{9 - item}</p>
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item % 2 === 0 ? '#EF4223' : '#FFB23F' }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {item % 2 === 0 ? '반야심경 이어보기 →' : '화엄경 이어보기 →'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureCalendarPage;
