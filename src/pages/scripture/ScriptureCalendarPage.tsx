
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
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
  
  const getProgressForDate = (date: number) => {
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
    return {
      id: schedule.id,
      title: matchingScripture?.title || '',
      color: matchingScripture?.colorScheme?.bg?.replace('bg-', '') || '[#DE7834]',
      textColor: matchingScripture?.colorScheme?.text?.replace('text-', '') || 'white',
      progress: matchingScripture?.progress || 0
    };
  });

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-5">
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/scripture')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">경전 읽기 캘린더</h1>
      </div>

      <div className="px-5 pt-5 pb-5">
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg">
          <button onClick={goToPrevMonth}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-medium">
            {year}년 {monthNames[month]}
          </h2>
          <button onClick={goToNextMonth}>
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="grid grid-cols-7 mb-2">
            {weekdays.map((day, index) => (
              <div 
                key={index} 
                className={`text-center text-sm font-medium ${index === 0 ? 'text-red-500' : 'text-gray-600'}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {prevMonthDays.map((day, index) => (
              <div 
                key={`prev-${index}`} 
                className="h-9 flex justify-center items-center text-gray-400 text-sm"
              >
                {day}
              </div>
            ))}
            
            {days.map((day) => {
              const isToday = day === new Date().getDate() && 
                             month === new Date().getMonth() && 
                             year === new Date().getFullYear();
              
              const progressData = getProgressForDate(day);
              const hasProgress = !!progressData;
              
              return (
                <div 
                  key={`current-${day}`} 
                  className={`h-9 flex justify-center items-center relative ${
                    isToday ? 'bg-[#DE7834] text-white rounded-full' : 
                    hasProgress ? 'text-black font-medium' : 'text-black'
                  }`}
                >
                  {day}
                  {hasProgress && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#DE7834] rounded-full"></div>
                  )}
                </div>
              );
            })}
            
            {nextMonthDays.map((day, index) => (
              <div 
                key={`next-${index}`} 
                className="h-9 flex justify-center items-center text-gray-400 text-sm"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="text-base font-medium mb-3">
            인기 경전 중
          </h3>
          
          <div className="space-y-4">
            {readingItems.map((item, index) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 bg-${item.color} text-${item.textColor} rounded-full text-xs font-medium`}>
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.progress.toFixed(1)}%
                  </div>
                </div>
                
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-500">
                  {index === 0 ? '다음 학습 권장일: 10일 후' : '다음 핵습 권장일: 17일 후'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">
            나의 경전 여정
          </h3>
          
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">금시심경 제{item}장 학습 완료했습니다</p>
                  <p className="text-xs text-gray-500">2025-04-0{item}</p>
                </div>
                <div className="bg-red-500 w-2 h-2 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureCalendarPage;
