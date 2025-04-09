import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Bookmark, ChevronRight } from 'lucide-react';
import { scriptureTexts, readingSchedule, calendarData } from '@/data/scriptureData';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import ScriptureProgressPreview from '@/components/scripture/ScriptureProgressPreview';

const Scripture = () => {
  const navigate = useNavigate();

  // Filter scriptures with progress
  const activeScriptures = Object.entries(scriptureTexts)
    .map(([key, scripture]) => ({ 
      key, 
      ...scripture,
      progress: readingSchedule.find(s => s.category === key)?.progress || 0
    }))
    .filter(scripture => scripture.progress > 0);
  
  // Filter scriptures without progress
  const unreadScriptures = Object.entries(scriptureTexts)
    .map(([key, scripture]) => ({ 
      key, 
      ...scripture,
      progress: readingSchedule.find(s => s.category === key)?.progress || 0
    }))
    .filter(scripture => scripture.progress === 0);

  // Get the next 7 days for calendar preview
  const getRecentDates = () => {
    const today = new Date();
    return calendarData
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= today && itemDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      })
      .slice(0, 2);
  };

  const recentDates = getRecentDates();

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/main')}
          className="mr-4"
        >
          <Home size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">경전 읽기</h1>
        <button
          onClick={() => navigate('/scripture/bookmarks')}
          className="ml-auto"
        >
          <Bookmark size={24} />
        </button>
      </div>

      <div className="px-5 py-5">
        {/* Calendar Preview */}
        <div 
          className="bg-white rounded-xl p-4 mb-6 shadow-sm"
          onClick={() => navigate('/scripture/calendar')}
        >
          <ScriptureProgressPreview recentDates={recentDates} />
          <div className="flex justify-end mt-2">
            <button className="flex items-center text-[#767676] text-xs">
              캘린더 더보기 <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <h2 className="text-lg font-medium mb-4">
          이어보기
        </h2>

        {/* Active Reading List */}
        <div className="space-y-4 mb-8">
          {activeScriptures.map((scripture) => (
            <ScriptureCard
              key={scripture.key}
              scripture={{
                id: scripture.key,
                title: scripture.title,
                progress: scripture.progress,
                colorScheme: scripture.color
              }}
              onClick={() => navigate(`/scripture/${scripture.title}`)}
            />
          ))}
        </div>

        {/* Other Scriptures List */}
        {unreadScriptures.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">아직 펼치지 않은 이야기</h2>
            <div className="space-y-4">
              {unreadScriptures.map((scripture) => (
                <ScriptureCard
                  key={scripture.key}
                  scripture={{
                    id: scripture.key,
                    title: scripture.title,
                    progress: 0,
                    colorScheme: scripture.color
                  }}
                  onClick={() => navigate(`/scripture/${scripture.title}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scripture;
