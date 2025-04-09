
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ScriptureColorScheme } from '/public/data/scriptureData/scriptureRepository';

interface ScriptureCardProps {
  scripture: {
    id: string;
    title: string;
    progress: number;
    colorScheme: ScriptureColorScheme;
  };
  onClick?: () => void;
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ scripture, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/scripture/${scripture.id}`);
    }
  };

  return (
    <div 
      className="w-full bg-white rounded-2xl p-4 shadow-sm cursor-pointer flex items-center"
      onClick={handleClick}
    >
      <div className={`${scripture.colorScheme.bg} h-16 w-16 rounded-xl flex items-center justify-center shrink-0 mr-4`}>
        <span className={`${scripture.colorScheme.text} text-lg font-bold`}>{scripture.title.substring(0, 1)}</span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-base font-semibold mb-1">{scripture.title}</h3>
        
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className="h-2.5 rounded-full" 
              style={{
                width: `${scripture.progress}%`,
                backgroundColor: scripture.colorScheme.progressBg
              }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{scripture.progress.toFixed(1)}%</span>
        </div>
      </div>
      
      <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
    </div>
  );
};

export default ScriptureCard;
