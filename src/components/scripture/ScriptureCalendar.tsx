
import React from 'react';
import { calendarData, scriptureProgress } from '@/data/scriptureRepository';

const ScriptureCalendar: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold mb-4">
        {calendarData.currentMonth}
      </h2>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {calendarData.weekdays.map((day, index) => (
          <div key={index} className="text-center text-sm">
            {day}
          </div>
        ))}

        {calendarData.days.map((day, index) => (
          <div 
            key={index} 
            className={`
              aspect-square flex items-center justify-center rounded-full text-sm
              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
              ${day.day === 14 || day.day === 21 || day.day === 28 || day.isWeekend ? 'text-red-500' : ''}
              ${day.isSelected ? 'bg-orange-500 text-white' : ''}
              ${day.isHighlighted && !day.isSelected ? 'bg-orange-100' : ''}
            `}
          >
            {day.day}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-3">현재 진행 중</h3>
        
        {scriptureProgress.map((progress, index) => {
          const scripture = scriptures.find(s => s.id === progress.scriptureId);
          
          return (
            <div key={index} className="mb-4">
              <div className={`${progress.color} text-white rounded-md py-1 px-3 inline-block mb-2`}>
                {scripture?.categories[0]}
              </div>
              <p className="text-sm mb-1">보리님의 {scripture?.categories[0]} 독송</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${progress.color} h-2 rounded-full`} 
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">{progress.progress}%</span>
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-center mt-6">
          <button className="flex items-center text-gray-500 text-sm">
            <span>기록 데이터가 없어요</span>
            <span className="ml-2">📅</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptureCalendar;
