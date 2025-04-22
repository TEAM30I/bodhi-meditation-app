
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from 50% from-[#DE7834] to-[#d45c10] text-white p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">평화로운 마음의 여정</h1>
      <div 
        className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-3 cursor-pointer"
        onClick={() => navigate('/search')}
      >
        <Search className="w-5 h-5 mr-2 text-white" />
        <span className="text-white/80">사찰이나 템플스테이를 검색해보세요</span>
      </div>
    </div>
  );
};

export default MainBanner;
