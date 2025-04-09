
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { calendarData, scriptureColorSchemes } from '@/data/scriptureData';

const ScriptureCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Convert calendar data to dates for highlighting
  const highlightedDays = calendarData.map(item => new Date(item.date));

  // Function to custom render days with highlights
  const renderDay = (day: Date): React.ReactNode => {
    const calendarEvent = calendarData.find(item => 
      format(new Date(item.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    if (calendarEvent) {
      const colorScheme = scriptureColorSchemes[calendarEvent.title] || {
        bg: "bg-gray-500", 
        text: "text-white", 
        progressBg: "#CCCCCC"
      };
      
      return (
        <div className={`w-full h-full flex items-center justify-center rounded-full ${colorScheme.bg} ${colorScheme.text}`}>
          {day.getDate()}
        </div>
      );
    }
    
    return day.getDate();
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => {
              const prevMonth = new Date(currentMonth);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setCurrentMonth(prevMonth);
            }}
            className="p-1"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-base font-medium">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </h2>
          <button 
            onClick={() => {
              const nextMonth = new Date(currentMonth);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setCurrentMonth(nextMonth);
            }}
            className="p-1"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <Calendar
          mode="single"
          selected={new Date()}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border-none"
          modifiers={{
            highlighted: highlightedDays
          }}
          components={{
            Day: ({ date, ...props }) => <div {...props}>{renderDay(date)}</div>
          }}
        />
      </div>
      
      <div className="px-4 py-3 bg-white">
        <h3 className="text-base font-medium mb-3">현재 진행 중</h3>
        {calendarData
          .filter(item => item.progress > 0)
          .map((item, index) => {
            const colorScheme = scriptureColorSchemes[item.title] || {
              bg: "bg-gray-500", 
              text: "text-white", 
              progressBg: "#CCCCCC"
            };
            
            return (
              <div key={index} className="mb-4">
                <div className="flex items-center mb-1">
                  <div className={`px-2 py-1 rounded-md text-xs font-medium mr-2 ${colorScheme.bg} ${colorScheme.text}`}>
                    {item.title}
                  </div>
                  <span className="text-xs text-gray-500">
                    보현보살의 반야심경 독독
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${item.progress}%`,
                        backgroundColor: colorScheme.progressBg
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 ml-2 min-w-[40px] text-right">
                    {item.progress}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.progress > 50 
                    ? '17일 동안 연속해서 읽었어요!' 
                    : '이제 막 시작했어요!'
                  }
                </p>
              </div>
            );
          })}
        
        <div className="flex items-center justify-center border-t border-gray-200 pt-4 mt-4">
          <button className="flex items-center text-sm text-gray-600">
            기록 더보기가 있어요
            <CalendarIcon size={16} className="ml-1" />
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-white">
        <h3 className="text-base font-medium mb-3">나의 경전 여정</h3>
        {/* Reading history list */}
        <div className="space-y-4">
          <div className="flex">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium">보현보살의 금강경24단티비와 함께하다</p>
              <p className="text-xs text-gray-500">2025.04.08</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium">삼신불이 중생과 31마리의 물고기 발견하다</p>
              <p className="text-xs text-gray-500">2025.04.09</p>
              <span className="text-xs text-gray-500">🔍 해설보기 →</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium">삼신불이 중생과 28마리의 벌레 숨겨 두었다</p>
              <p className="text-xs text-gray-500">2025.04.09</p>
              <span className="text-xs text-gray-500">🔍 해설보기 →</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium">삼신불이 중생과 108마리의 뱀과 마주치다</p>
              <p className="text-xs text-gray-500">2025.04.09</p>
              <span className="text-xs text-gray-500">🔍 해설보기 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureCalendar;
