
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { scriptures, readingSchedule } from '@/data/scriptureRepository';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import BottomNav from '@/components/BottomNav';
import { Calendar } from '@/components/ui/calendar';

const Scripture = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // 각 경전별 색상 매핑
  const scriptureColors: Record<string, { bg: string, text: string }> = {
    "금강경": { bg: "bg-black", text: "text-white" },
    "반야심경": { bg: "bg-red-500", text: "text-white" },
    "법화경": { bg: "bg-blue-500", text: "text-white" },
    "용수경": { bg: "bg-green-500", text: "text-white" },
    "반야심": { bg: "bg-red-500", text: "text-white" }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full py-4 px-6 flex items-center border-b">
        <button 
          onClick={() => {
            alert("메인페이지로 돌아가려면 한 번 더 클릭하세요");
            setTimeout(() => {
              navigate('/main');
            }, 300);
          }}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-center flex-1">경전 읽기</h1>
      </div>

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
        <div className="mt-10">
          <h2 className="text-lg font-medium mb-4">경전 읽기 캘린더</h2>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </div>

          {/* Current Progress */}
          <h2 className="text-lg font-medium mb-4">현재 진행 중</h2>
          
          {/* Progress Cards */}
          <div className="space-y-4">
            {/* Banya Scripture Card */}
            <div className="bg-white rounded-3xl shadow-sm p-5">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">반야심경</span>
              </div>
              <p className="text-sm font-medium mb-1">보리[11장]의 반야심경 통독</p>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{width: '25.5%'}}></div>
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">25.5%</span>
              </div>
            </div>

            {/* Hwaeom Scripture Card */}
            <div className="bg-white rounded-3xl shadow-sm p-5">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-orange-400 text-white text-sm rounded-full">화엄경</span>
              </div>
              <p className="text-sm font-medium mb-1">보리[11장]의 반야심경 통독</p>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{width: '87.8%'}}></div>
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">87.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Scripture;
