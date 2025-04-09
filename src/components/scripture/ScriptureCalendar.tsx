import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';

// Use path that matches our wildcard type definition
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
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">{formattedDate}</h3>
          <button 
            className="text-sm text-blue-600"
            onClick={() => navigate('/scripture/calendar')}
          >
            전체 캘린더 보기
          </button>
        </div>
        
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">
          이번 달 경전 읽기: {completedDays}/{totalDays} 일
        </p>
        
        <div className="space-y-3">
          {thisMonthData.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
              <div className="flex-1">
                <p className="text-sm">{item.title}</p>
                <div className="flex items-center">
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden mr-2">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{item.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="w-full py-3 bg-gray-100 rounded-lg text-center text-gray-700 text-sm"
        onClick={() => navigate('/scripture/calendar')}
      >
        <Calendar className="inline-block mr-2 h-4 w-4" />
        달력으로 보기
      </button>
    </div>
  );
};
