
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Scripture } from '@/types/scripture';

interface ScriptureProgressListProps {
  scriptures: Scripture[];
  onScriptureClick: (scriptureId: string, lastPage?: number) => void;
}

const ScriptureProgressList: React.FC<ScriptureProgressListProps> = ({ scriptures, onScriptureClick }) => {
  return (
    <div className="space-y-3">
      {scriptures.map((scripture, index) => {
        const scriptureColors = [
          { bg: 'bg-[#21212F]', text: 'text-white' },
          { bg: 'bg-[#EF4223]', text: 'text-white' },
          { bg: 'bg-[#FFB23F]', text: 'text-white' }
        ];
        
        const colorIndex = index % scriptureColors.length;
        
        return (
          <div 
            key={scripture.id} 
            className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-sm cursor-pointer"
            onClick={() => onScriptureClick(scripture.id, scripture.lastPage)}
          >
            <div className="flex flex-col gap-3">
              <div className={`inline-flex px-2 py-2 ${scriptureColors[colorIndex].bg} rounded-xl w-fit`}>
                <span className={`text-xs font-medium ${scriptureColors[colorIndex].text}`}>
                  {scripture.title}
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-800">
                    {scripture.lastChapterTitle || "처음부터 시작하기"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {scripture.progress?.toFixed(1) || "0"}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-[#DE7834]"
                    style={{ width: `${scripture.progress || 0}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-1 justify-end">
                <span className="text-xs text-gray-400">
                  이어서 읽기
                </span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScriptureProgressList;
