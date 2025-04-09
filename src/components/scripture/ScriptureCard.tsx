
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Scripture } from '@/data/scriptureData';

interface ScriptureCardProps {
  scripture: Scripture;
  schedule?: {
    title: string;
    chapter: string;
    progress: number;
  };
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ scripture, schedule }) => {
  const navigate = useNavigate();
  const progress = schedule?.progress || scripture.progress || 0;
  const colorScheme = scripture.colorScheme || {
    bg: "bg-gray-500",
    text: "text-white",
    progressBg: "#CCCCCC"
  };
  
  return (
    <div 
      className="w-full bg-white rounded-[20px] p-5 shadow-sm cursor-pointer"
      onClick={() => navigate(`/scripture/${scripture.id}`)}
    >
      <div className="flex flex-col gap-3">
        <div className={`inline-flex px-4 py-2 ${colorScheme.bg} rounded-[12px] w-fit`}>
          <span className={`text-xs font-medium ${colorScheme.text} tracking-[-0.3px]`}>
            {scripture.categories[0]}
          </span>
        </div>
        
        {progress > 0 && (
          <div className="w-full h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: colorScheme.progressBg
              }}
            />
          </div>
        )}
        
        <div className="flex flex-col gap-[6px]">
          <h3 className="text-base font-semibold text-[#111] tracking-[-0.4px]">
            {schedule?.title || scripture.title}
          </h3>
          {schedule?.chapter && (
            <p className="text-[#767676] text-base font-medium tracking-[-0.4px]">
              {schedule.chapter}
            </p>
          )}
          {progress > 0 && (
            <p className="text-xs text-gray-500 text-right">
              {progress.toFixed(1)}%
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-[2px] justify-end">
          <span className="text-xs text-[#767676] font-medium tracking-[-0.3px]">
            {progress > 0 ? "이어보기" : "시작하기"}
          </span>
          <ChevronRight className="w-3 h-3 stroke-[#767676]" />
        </div>
      </div>
    </div>
  );
};

export default ScriptureCard;
