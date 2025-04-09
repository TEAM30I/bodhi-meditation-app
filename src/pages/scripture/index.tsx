import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, ChevronRight, Home } from 'lucide-react';
import { scriptures, readingSchedule, calendarData } from '@/data/scriptureData';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import ScriptureProgressPreview from '@/components/scripture/ScriptureProgressPreview';

const Scripture = () => {
  const navigate = useNavigate();

  // Filter active reading schedules
  const activeReadingSchedules = readingSchedule.filter(schedule => schedule.progress > 0);
  
  // Filter unstarted scriptures
  const unreadScriptures = scriptures.filter(scripture => 
    !activeReadingSchedules.some(schedule => 
      scripture.categories.includes(schedule.category)
    )
  );

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
        <h2 className="text-lg font-medium mb-4">
          이어보기
        </h2>

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

        {/* Active Reading List */}
        <div className="space-y-4 mb-8">
          {activeReadingSchedules.map((schedule) => {
            const matchingScripture = scriptures.find(
              s => s.categories.includes(schedule.category)
            );
            
            if (!matchingScripture) return null;

            return (
              <ScriptureCard
                key={schedule.id}
                scripture={matchingScripture}
                schedule={schedule}
              />
            );
          })}
        </div>

        {/* Other Scriptures List */}
        {unreadScriptures.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">아직 펼치지 않은 이야기</h2>
            <div className="space-y-4">
              {unreadScriptures.map((scripture) => (
                <ScriptureCard
                  key={scripture.id}
                  scripture={scripture}
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
