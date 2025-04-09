
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { scriptures, readingSchedule, scriptureColorSchemes } from '@/data/scriptureData';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';
import ScriptureCalendar from '@/components/scripture/ScriptureCalendar';
import BookmarkList from '@/components/scripture/BookmarkList';
import ShareOptions from '@/components/scripture/ShareOptions';
import SettingsPanel from '@/components/scripture/SettingsPanel';

const Scripture = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reading' | 'calendar' | 'bookmark' | 'share' | 'settings'>('reading');

  const handleTabChange = (tab: 'reading' | 'calendar' | 'bookmark' | 'share' | 'settings') => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/main')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">경전 읽기</h1>
      </div>

      {activeTab === 'reading' ? (
        <div className="px-5 py-4">
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
              
              if (!matchingScripture) return null;

              return (
                <ScriptureCard
                  key={schedule.id}
                  scripture={{
                    id: matchingScripture.id,
                    title: matchingScripture.title,
                    progress: matchingScripture.progress || 0,
                    colorScheme: matchingScripture.colorScheme || scriptureColorSchemes[schedule.category]
                  }}
                />
              );
            })}
          </div>

          {/* 다른 경전 목록 */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">다른 경전 읽기</h2>
            <div className="space-y-4">
              {scriptures.map((scripture) => {
                // readingSchedule에 이미 포함된 경전은 제외
                const alreadyIncluded = readingSchedule.some(
                  schedule => scripture.categories.includes(schedule.category)
                );
                
                if (alreadyIncluded) return null;
                
                return (
                  <ScriptureCard
                    key={scripture.id}
                    scripture={{
                      id: scripture.id,
                      title: scripture.title,
                      progress: scripture.progress || 0,
                      colorScheme: scripture.colorScheme || scriptureColorSchemes[scripture.categories[0]]
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 py-4">
          {activeTab === 'calendar' && <ScriptureCalendar />}
          {activeTab === 'bookmark' && <BookmarkList />}
          {activeTab === 'share' && <ShareOptions />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      )}

      {/* Scripture Bottom Navigation */}
      <ScriptureBottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default Scripture;
