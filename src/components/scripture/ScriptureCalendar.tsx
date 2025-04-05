
import React from 'react';
import { calendarData } from '@/data/scriptureRepository';

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{calendarData.currentMonth}</h2>
        <div className="flex space-x-2">
          <button className="text-gray-500">&lt;</button>
          <button className="text-gray-500">&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {calendarData.weekdays.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map((day, index) => (
          <div
            key={index}
            className={`
              h-8 flex items-center justify-center text-sm rounded-full cursor-pointer
              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
              ${day.isSelected ? 'bg-bodhi-orange text-white' : ''}
              ${day.isHighlighted && !day.isSelected ? 'text-bodhi-orange' : ''}
              ${day.isWeekend && !day.isSelected ? 'text-red-500' : ''}
            `}
            onClick={() => handleDateClick(day.day, day.isCurrentMonth)}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptureCalendar;
