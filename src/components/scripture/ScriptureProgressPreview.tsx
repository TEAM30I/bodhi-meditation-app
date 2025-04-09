
import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarDays, ChevronRight } from 'lucide-react';

interface ProgressPreviewProps {
  recentDates: {
    date: Date;
    title: string;
    completed: boolean;
    progress: number;
  }[];
}

const ScriptureProgressPreview = ({ recentDates }: ProgressPreviewProps) => {
  const today = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  // Get the current week dates
  const getWeekDates = () => {
    const currentDay = today.getDay(); // 0-6 (Sunday-Saturday)
    const dates = [];
    
    // Get the dates for the current week (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      
      // Find if there's a reading scheduled for this date
      const scheduledReading = recentDates.find(
        item => item.date.getDate() === date.getDate() && 
               item.date.getMonth() === date.getMonth() && 
               item.date.getFullYear() === date.getFullYear()
      );
      
      dates.push({
        date,
        day: days[i],
        hasReading: Boolean(scheduledReading),
        isToday: date.getDate() === today.getDate() && 
                 date.getMonth() === today.getMonth() && 
                 date.getFullYear() === today.getFullYear(),
        reading: scheduledReading
      });
    }
    
    return dates;
  };
  
  const weekDates = getWeekDates();
  const currentMonth = format(today, 'M', { locale: ko });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />
          <h3 className="text-base font-medium">경전 캘린더</h3>
        </div>
        <span className="text-sm text-gray-500">{currentMonth}월</span>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center mb-3">
        {weekDates.map((date, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{date.day}</span>
            <div 
              className={`w-7 h-7 flex items-center justify-center rounded-full text-sm
                ${date.isToday ? 'bg-[#FF4D00] text-white' : 'text-black'}
                ${date.hasReading && !date.isToday ? 'bg-[#FFE9E0]' : ''}
              `}
            >
              {date.date.getDate()}
            </div>
            {date.hasReading && (
              <div className="w-1 h-1 bg-[#FF4D00] rounded-full mt-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptureProgressPreview;
