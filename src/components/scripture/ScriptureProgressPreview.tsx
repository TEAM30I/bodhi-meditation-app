
import React from 'react';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ScriptureProgressPreviewProps {
  recentDates: Array<{
    date: Date;
    title: string;
    progress: number;
  }>;
}

const ScriptureProgressPreview: React.FC<ScriptureProgressPreviewProps> = ({ recentDates }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={20} className="text-gray-700" />
        <h3 className="font-medium">경전 읽기 캘린더</h3>
      </div>

      {recentDates.length > 0 ? (
        <div className="space-y-3">
          {recentDates.map((item, index) => {
            const dateStr = format(new Date(item.date), 'M월 d일', { locale: ko });
            const color = item.title === '금강경' ? '#FF4D00' : 
                         item.title === '반야심경' ? '#FF9B21' : 
                         item.title === '법화경' ? '#0080FF' : '#4CAF50';
            
            return (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{dateStr}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <div className="w-full h-1 bg-[#EEEEEE] rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${item.progress}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">다음 7일간 예정된 경전 읽기가 없습니다.</p>
      )}
    </div>
  );
};

export default ScriptureProgressPreview;
