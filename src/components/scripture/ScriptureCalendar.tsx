import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronRight } from 'lucide-react';
import { calendarData } from '/public/data/scriptureData/scriptureRepository';

interface ScriptureProgressPreviewProps {
  recentDates?: {
    date: Date;
    title: string;
    completed: boolean;
    progress: number;
  }[];
}

const ScriptureProgressPreview: React.FC<ScriptureProgressPreviewProps> = ({ recentDates }) => {
  const dates = recentDates || calendarData.slice(0, 2);
  
  // Get day of week in Korean
  const getDayOfWeek = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  return (
    <div>
      <h3 className="text-base font-medium mb-3">경전 캘린더</h3>
      <div className="space-y-3">
        {dates.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex flex-col items-center justify-center mr-4">
              <span className="text-xs text-gray-500">{getDayOfWeek(item.date)}</span>
              <span className="text-sm font-bold">{item.date.getDate()}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.title === '금강경' ? '#FF4D00' : 
                                      item.title === '반야심경' ? '#FF9B21' : '#0080FF'
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{item.progress.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ScriptureCalendar: React.FC = () => {
  const today = new Date();
  
  // Get day of week in Korean
  const getDayOfWeek = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-4">이번 달 경전읽기</h3>
        <Calendar
          mode="single"
          selected={today}
          className="rounded-md border"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">경전 기록</h3>
          <button className="flex items-center text-gray-500 text-sm">
            전체보기 <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          {calendarData.slice(0, 3).map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex flex-col items-center justify-center mr-4">
                  <span className="text-xs text-gray-500">{getDayOfWeek(item.date)}</span>
                  <span className="text-sm font-bold">{item.date.getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{
                          width: `${item.progress}%`,
                          backgroundColor: item.title === '금강경' ? '#FF4D00' : 
                                          item.title === '반야심경' ? '#FF9B21' : '#0080FF'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{item.progress.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ScriptureProgressPreview };
