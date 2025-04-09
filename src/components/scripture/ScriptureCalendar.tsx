
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { calendarData } from '/public/data/scriptureData/scriptureRepository';

interface ScriptureProgressPreviewProps {
  recentDates?: {
    date: Date;
    title: string;
    completed: boolean;
    progress: number;
  }[];
}

export const ScriptureCalendar: React.FC<ScriptureProgressPreviewProps> = ({ recentDates }) => {
  const typedCalendarData = typedData<typeof calendarData>(calendarData);
  const dates = recentDates || typedCalendarData;
  
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">캘린더</h3>
          <button className="text-sm text-gray-500 flex items-center">
            {currentMonth} <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <Calendar
          mode="single"
          selected={today}
          onSelect={() => {}}
          disabled={(date) => date > new Date()}
          classNames={{
            day_selected: "bg-[#DE7834] text-white hover:bg-[#DE7834]",
          }}
        />
      </div>
      
      <div className="bg-white p-4 rounded-xl">
        <h3 className="text-lg font-medium mb-4">진행상황</h3>
        
        <div className="space-y-4">
          {dates.slice(0, 3).map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-gray-500">
                  {item.date.toLocaleDateString()}
                </span>
              </div>
              
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#DE7834] rounded-full"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">진행률</span>
                <span className="font-medium">{item.progress.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
