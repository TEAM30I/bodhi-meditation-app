
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ScriptureCalendar from '@/components/scripture/ScriptureCalendar';

const ScriptureCalendarPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-5">
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/scripture')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">경전 읽기 캘린더</h1>
      </div>

      <div className="px-5 pt-5 pb-5">
        <ScriptureCalendar />
      </div>
    </div>
  );
};

export default ScriptureCalendarPage;
