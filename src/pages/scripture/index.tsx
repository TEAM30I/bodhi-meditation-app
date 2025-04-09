
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Heart } from 'lucide-react';
import { scriptures, readingSchedule, calendarData } from '/public/data/scriptureData/scriptureRepository';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';
import { ScriptureCalendar } from '@/components/scripture/ScriptureCalendar';
import BookmarkList from '@/components/scripture/BookmarkList';
import ShareOptions from '@/components/scripture/ShareOptions';
import SettingsPanel from '@/components/scripture/SettingsPanel';

const Scripture = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reading' | 'calendar' | 'bookmark' | 'share' | 'settings'>('reading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calendar days
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  const currentDate = today.getDate();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(currentDate - 3 + i);
    return {
      day: weekDays[date.getDay()],
      date: date.getDate(),
      active: i === 3, // Today is active
    };
  });

  const handleTabChange = (tab: 'reading' | 'calendar' | 'bookmark' | 'share' | 'settings') => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
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

      {/* Calendar */}
      <div className="bg-white px-5 py-3 mb-2">
        <div className="flex justify-between">
          {dates.map((date, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center"
            >
              <span className="text-xs text-gray-500 mb-1">{date.day}</span>
              <div className={`w-7 h-7 flex items-center justify-center rounded-full ${date.active ? 'bg-[#DE7834] text-white' : 'text-black'}`}>
                {date.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeTab === 'reading' ? (
        <div className="px-5 py-4">
          <h2 className="text-base font-medium mb-5">
            이어하기
          </h2>

          {/* 읽을 경전 목록 */}
          <div className="space-y-3 mb-6">
            {readingSchedule.map((schedule, index) => {
              // Find the scripture by scriptureId
              const matchingScripture = Object.values(scriptures).find(
                s => s.id === schedule.scriptureId
              );
              
              if (!matchingScripture) return null;
              
              const progressColor = matchingScripture.colorScheme?.progressBg || "#DE7834";
              
              return (
                <div 
                  key={schedule.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                >
                  <div className="flex flex-col mb-3">
                    <div className={`inline-flex px-3 py-1 ${matchingScripture.colorScheme?.bg || 'bg-[#DE7834]'} rounded-full w-fit mb-2`}>
                      <span className={`text-xs font-medium ${matchingScripture.colorScheme?.text || 'text-white'}`}>
                        {matchingScripture.title}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-800 mb-1">
                      "{schedule.title}"
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {schedule.chapter}
                    </p>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${matchingScripture.progress || 0}%`,
                        backgroundColor: progressColor
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500">
                    {matchingScripture.progress || 0}%
                  </p>
                </div>
              );
            })}
          </div>

          {/* 다른 경전 목록 */}
          <div className="mb-6">
            <h2 className="text-base font-medium mb-4">다른 경전 읽기</h2>
            <div className="space-y-3">
              {Object.values(scriptures).map((scripture) => {
                // Check if this scripture is already in readingSchedule
                const alreadyIncluded = readingSchedule.some(
                  schedule => schedule.scriptureId === scripture.id
                );
                
                if (alreadyIncluded) return null;
                
                const progressColor = scripture.colorScheme?.progressBg || "#DE7834";
                
                return (
                  <div 
                    key={scripture.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    onClick={() => navigate(`/scripture/${scripture.id}`)}
                  >
                    <div className="flex flex-col mb-3">
                      <div className={`inline-flex px-3 py-1 ${scripture.colorScheme?.bg || 'bg-[#DE7834]'} rounded-full w-fit mb-2`}>
                        <span className={`text-xs font-medium ${scripture.colorScheme?.text || 'text-white'}`}>
                          {scripture.title}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-medium text-gray-800 mb-1">
                        {scripture.title} 읽기 시작하기
                      </h3>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${scripture.progress || 0}%`,
                          backgroundColor: progressColor
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">
                      {scripture.progress || 0}%
                    </p>
                  </div>
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
