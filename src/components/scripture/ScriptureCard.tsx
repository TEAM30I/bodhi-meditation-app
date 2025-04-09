import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scripture } from '@/data/scriptureData';

interface ScriptureCardProps {
  scripture: Scripture;
  color: string;
  textColor: string;
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ scripture, color, textColor }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center mb-4 cursor-pointer"
      onClick={() => navigate(`/scripture/${scripture.id}`)}
    >
      <div className={`${color} w-16 h-10 rounded-md flex items-center justify-center ${textColor}`}>
        <span className="text-xs font-bold">{scripture.categories[0]}</span>
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-bold text-gray-800">{scripture.title}</h3>
        <p className="text-xs text-gray-500">
          {scripture.hasStarted ? `이어읽기 (${Math.round(scripture.lastReadPosition! / scripture.content.length * 100)}% 완료)` : "시작하기"}
        </p>
      </div>
      <button className="text-gray-500 text-sm">
        {scripture.hasStarted ? "이어읽기" : "시작하기"} &gt;
      </button>
    </div>
  );
};

export default ScriptureCard;
