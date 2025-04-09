
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { scriptures, readingSchedule, calendarData } from '../../../public/data/scriptureData/scriptureRepository';

const Scripture = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Type our data correctly
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);
  const typedCalendarData = typedData<typeof calendarData>(calendarData);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calendar days for the week
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  
  // Generate dates for the calendar
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i - 7); // Show some days before and after today
    return {
      day: weekDays[date.getDay()],
      date: date.getDate(),
      active: i === 7, // Today is active
      hasReading: Math.random() > 0.5, // Random for demo
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full flex items-center justify-between border-b border-[#E5E5EC] px-5 py-3">
        <button onClick={() => navigate('/main')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">경전 읽기</h1>
        <button 
          onClick={() => navigate('/scripture/calendar')}
          className="text-[#FF4D00]"
        >
          캘린더 <ChevronRight size={16} className="inline" />
        </button>
      </div>

      {/* Weekly Calendar */}
      <div className="px-5 pt-4 pb-2 border-b border-gray-100">
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {dates.slice(0, 7).map((date, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">{date.day}</span>
              <div 
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm
                  ${date.active ? 'bg-[#FF4D00] text-white' : 'text-black'}
                `}
              >
                {date.date}
              </div>
              {date.hasReading && (
                <div className="w-1 h-1 bg-[#FF4D00] rounded-full mt-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <h2 className="text-lg font-medium mb-3">
          이어하기
        </h2>

        {/* 읽을 경전 목록 */}
        <div className="space-y-3 mb-6">
          {typedReadingSchedule.map((schedule, index) => {
            // Find the scripture by scriptureId
            const matchingScripture = Object.values(typedScriptures).find(
              s => s.id === schedule.scriptureId
            );
            
            if (!matchingScripture) return null;
            
            const progressColor = matchingScripture.colorScheme?.progressBg || "#FF4D00";
            
            return (
              <div 
                key={schedule.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`px-3 py-1 ${matchingScripture.colorScheme?.bg || 'bg-[#FF4D00]'} rounded-full`}>
                    <span className={`text-xs font-medium ${matchingScripture.colorScheme?.text || 'text-white'}`}>
                      {matchingScripture.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{matchingScripture.progress || 0}%</span>
                </div>
                  
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  {schedule.title}
                </h3>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${matchingScripture.progress || 0}%`,
                      backgroundColor: progressColor
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 다른 경전 목록 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">다른 경전 읽기</h2>
          <div className="space-y-3">
            {Object.values(typedScriptures).map((scripture) => {
              // Check if this scripture is already in readingSchedule
              const alreadyIncluded = typedReadingSchedule.some(
                schedule => schedule.scriptureId === scripture.id
              );
              
              if (alreadyIncluded) return null;
              
              const bgColor = scripture.colorScheme?.bg || "bg-blue-500";
              
              return (
                <div 
                  key={scripture.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  onClick={() => navigate(`/scripture/${scripture.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-3 py-1 ${bgColor} rounded-full`}>
                      <span className={`text-xs font-medium ${scripture.colorScheme?.text || 'text-white'}`}>
                        {scripture.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">0%</span>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    {scripture.title} 읽기 시작하기
                  </h3>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-gray-200"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scripture;
