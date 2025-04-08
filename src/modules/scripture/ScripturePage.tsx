
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { scriptures, readingSchedule } from '@/data/scriptureRepository';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import BottomNav from '@/components/BottomNav';
import ScriptureCalendar from '@/components/scripture/ScriptureCalendar';

const ScripturePage = () => {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // 각 경전별 색상 매핑
  const scriptureColors: Record<string, { bg: string, text: string }> = {
    "금강경": { bg: "bg-black", text: "text-white" },
    "반야심경": { bg: "bg-red-500", text: "text-white" },
    "법화경": { bg: "bg-blue-500", text: "text-white" },
    "용수경": { bg: "bg-green-500", text: "text-white" },
    "반야심": { bg: "bg-red-500", text: "text-white" }
  };

  const handleBackClick = () => {
    if (showExitConfirm) {
      navigate('/main');
    } else {
      setShowExitConfirm(true);
      // 3초 후 상태 원래대로
      setTimeout(() => {
        setShowExitConfirm(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full py-4 px-6 flex items-center border-b">
        <button 
          onClick={handleBackClick}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-center flex-1">경전 읽기</h1>
        <button 
          onClick={() => navigate('/main')}
          className="text-gray-800"
        >
          <Home size={24} />
        </button>
      </div>
      
      {showExitConfirm && (
        <div className="bg-gray-800 text-white text-center py-2 px-4">
          뒤로가기를 한번 더 누르면 메인페이지로 돌아갑니다.
        </div>
      )}

      <div className="px-6 py-4">
        <h2 className="text-lg font-medium mb-6">
          오늘의 경전 스케줄을 완료하세요
        </h2>

        {/* 읽을 경전 목록 */}
        <div className="space-y-4 mb-8">
          {readingSchedule.map((schedule) => {
            // 해당 카테고리의 경전 찾기
            const matchingScripture = scriptures.find(
              s => s.categories.includes(schedule.category)
            );

            const color = scriptureColors[schedule.category]?.bg || "bg-gray-500";
            const textColor = scriptureColors[schedule.category]?.text || "text-white";
            
            if (!matchingScripture) return null;

            return (
              <ScriptureCard
                key={schedule.id}
                scripture={matchingScripture}
                color={color}
                textColor={textColor}
              />
            );
          })}
        </div>

        {/* 다른 경전 목록 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">다른 경전 읽기</h2>
          {scriptures.map((scripture) => {
            // readingSchedule에 이미 포함된 경전은 제외
            const alreadyIncluded = readingSchedule.some(
              schedule => scripture.categories.includes(schedule.category)
            );
            
            if (alreadyIncluded) return null;
            
            const category = scripture.categories[0];
            const color = scriptureColors[category]?.bg || "bg-gray-500";
            const textColor = scriptureColors[category]?.text || "text-white";
            
            return (
              <ScriptureCard
                key={scripture.id}
                scripture={scripture}
                color={color}
                textColor={textColor}
              />
            );
          })}
        </div>

        {/* Calendar Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">읽기 캘린더</h2>
          <ScriptureCalendar />
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ScripturePage;
