
import React from 'react';
import { calendarData } from '@/data/scriptureRepository';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScriptureCalendarProps {
  onDateSelect?: (day: number) => void;
}

const ScriptureCalendar: React.FC<ScriptureCalendarProps> = ({ onDateSelect }) => {
  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth && onDateSelect) {
      onDateSelect(day);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">{calendarData.currentMonth}</h2>
        <div className="flex space-x-2">
          <button className="text-gray-500 p-1">
            <ChevronLeft size={20} />
          </button>
          <button className="text-gray-500 p-1">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {calendarData.weekdays.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarData.days.map((day, index) => (
          <div
            key={index}
            className={`
              h-10 flex items-center justify-center text-sm rounded-full cursor-pointer
              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
              ${day.isSelected ? 'bg-bodhi-orange text-white' : ''}
              ${day.isHighlighted && !day.isSelected ? 'text-bodhi-orange font-bold' : ''}
              ${day.isWeekend && !day.isSelected ? 'text-red-500' : ''}
            `}
            onClick={() => handleDateClick(day.day, day.isCurrentMonth)}
          >
            {day.day}
          </div>
        ))}
      </div>
      
      {/* Reading Schedule */}
      <div className="mt-6">
        <h3 className="text-md font-bold mb-3">이번 달 독서 계획</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Badge variant="outline" className="bg-bodhi-orange text-white mr-2 w-8 h-8 rounded-full flex items-center justify-center">
              9
            </Badge>
            <span className="text-sm">4월 9일 - 반야심경 읽기</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-gray-200 mr-2 w-8 h-8 rounded-full flex items-center justify-center">
              16
            </Badge>
            <span className="text-sm">4월 16일 - 법화경 읽기</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-gray-200 mr-2 w-8 h-8 rounded-full flex items-center justify-center">
              23
            </Badge>
            <span className="text-sm">4월 23일 - 금강경 읽기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureCalendar;
