
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { scriptures, readingSchedule } from '@/data/scriptureData';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';
import { ScriptureCalendar } from '@/components/scripture/ScriptureCalendar';
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
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full py-4 px-6 flex items-center border-b">
        <button 
          onClick={() => navigate('/main')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-center flex-1">경전 읽기</h1>
      </div>

      {activeTab === 'reading' ? (
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium mb-6">
            오늘의 경전 스케줄을 완료하세요
          </h2>

          {/* 읽을 경전 목록 */}
          <div className="space-y-4 mb-8">
            {readingSchedule.map((schedule) => {
              // Find the scripture by scriptureId
              const matchingScripture = Object.values(scriptures).find(
                s => s.id === schedule.scriptureId
              );
              
              if (!matchingScripture) return null;
              
              return (
                <ScriptureCard
                  key={schedule.id}
                  scripture={{
                    id: matchingScripture.id,
                    title: matchingScripture.title,
                    progress: matchingScripture.progress || 0,
                    colorScheme: matchingScripture.colorScheme
                  }}
                />
              );
            })}
          </div>

          {/* 다른 경전 목록 */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">다른 경전 읽기</h2>
            {Object.values(scriptures).map((scripture) => {
              // readingSchedule에 이미 포함된 경전은 제외
              const alreadyIncluded = readingSchedule.some(
                schedule => schedule.scriptureId === scripture.id
              );
              
              if (alreadyIncluded) return null;
              
              return (
                <ScriptureCard
                  key={scripture.id}
                  scripture={{
                    id: scripture.id,
                    title: scripture.title,
                    progress: scripture.progress || 0,
                    colorScheme: scripture.colorScheme
                  }}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-6 py-4">
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
