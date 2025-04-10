
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { ScriptureCalendar } from '@/components/scripture/ScriptureCalendar';

const ScriptureCalendarPage = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    // Go back to previous page instead of always redirecting to /scripture
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate('/main');
  };
  
  return (
    <div className="bg-[#F1F3F5] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between h-[56px] px-5 border-b border-[#EAECEE] bg-white">
        <div className="flex items-center gap-4">
          <button onClick={handleBackClick}>
            <ArrowLeft className="w-7 h-7" />
          </button>
          <h1 className="text-xl font-bold text-[#111]">경전 캘린더</h1>
        </div>
        <button onClick={handleHomeClick}>
          <Home className="w-6 h-6" />
        </button>
      </div>
      
      {/* Calendar */}
      <div className="p-5">
        <ScriptureCalendar />
      </div>
    </div>
  );
};

export default ScriptureCalendarPage;
