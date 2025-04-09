
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ScriptureCardProps {
  scripture: {
    id: string;
    title: string;
    progress: number;
    colorScheme: {
      bg: string;
      text: string;
      progressBg: string;
    };
  };
  onClick?: () => void;
}

const ScriptureCard = ({ scripture, onClick }: ScriptureCardProps) => {
  // Example descriptions for scriptures
  const descriptions: Record<string, string> = {
    "금강경": "불교의 지혜를 담은 금강경",
    "반야심경": "모든 고통에서 벗어나는 지혜의 핵심",
    "법화경": "연민과 구원의 메시지를 전하는 보살의 경전",
    "화엄경": "우주와 인간 존재의 상호 연결성을 탐구하는 경전"
  };

  // Get reading status message based on progress
  const getReadingStatus = (progress: number) => {
    if (progress === 0) return "읽기 시작하기";
    if (progress < 30) return "첫 장 읽기 중";
    if (progress < 60) return "중간 부분 읽는 중";
    if (progress < 100) return "마무리 단계";
    return "완독";
  };

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <div className={`inline-flex px-3 py-2 ${scripture.colorScheme.bg} rounded-[12px] w-fit`}>
          <span className={`text-xs font-medium ${scripture.colorScheme.text}`}>
            {scripture.title}
          </span>
        </div>
        
        <div className="flex flex-col gap-[6px]">
          <h3 className="text-base font-semibold text-[#111]">
            {descriptions[scripture.id] || `${scripture.title}의 지혜를 담은 경전`}
          </h3>
          
          {scripture.progress > 0 && (
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${scripture.progress}%`,
                  backgroundColor: scripture.colorScheme.progressBg
                }}
              ></div>
            </div>
          )}
          
          <p className="text-[#767676] text-sm">
            {getReadingStatus(scripture.progress)}
          </p>
        </div>
        
        <div className="flex items-center gap-[2px] justify-end">
          <span className="text-xs text-[#767676]">
            {scripture.progress > 0 ? '이어보기' : '시작하기'}
          </span>
          <ChevronRight className="w-3 h-3 stroke-[#767676]" />
        </div>
      </div>
    </div>
  );
};

export default ScriptureCard;
