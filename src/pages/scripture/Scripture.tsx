import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Home, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { scriptures, readingSchedule } from '../../../public/data/scriptureData/scriptureRepository';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';
import { ScriptureCalendar } from '@/components/scripture/ScriptureCalendar';
import BookmarkList from '@/components/scripture/BookmarkList';
import ShareOptions from '@/components/scripture/ShareOptions';
import SettingsPanel from '@/components/scripture/SettingsPanel';

const Scripture = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reading' | 'calendar' | 'bookmark' | 'share' | 'settings'>('reading');

  // Type our data properly
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);

  const handleTabChange = (tab: 'reading' | 'calendar' | 'bookmark' | 'share' | 'settings') => {
    setActiveTab(tab);
  };

  const handleNavigateToCalendar = () => {
    navigate('/scripture/calendar');
  };

  // Get the current date for the calendar header
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  const dayOfWeek = days[today.getDay()];
  const date = today.getDate();

  // Calendar dates for the week display
  const getWeekDates = () => {
    const dates = [];
    const currentDay = today.getDay();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      
      const isToday = i === currentDay;
      
      dates.push({
        day: days[i],
        date: date.getDate(),
        active: isToday,
        isPrayer: i === 0, // Sunday has prayer icon
      });
    }
    
    return dates;
  };
  
  const weekDates = getWeekDates();

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20 font-['Pretendard']">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/main')}
          className="mr-4"
        >
          <Home size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">경전 읽기</h1>
      </div>

      <div className="px-5 py-4">
        {activeTab === 'reading' ? (
          <>
            {/* Calendar Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">경전 캘린더</h2>
                <button 
                  className="text-xs text-gray-500 flex items-center gap-1"
                  onClick={handleNavigateToCalendar}
                >
                  더보기 <ChevronRight size={12} className="text-gray-500" />
                </button>
              </div>
              
              <div className="bg-white rounded-3xl p-3.5 shadow-sm">
                <div className="flex gap-0.5 overflow-x-auto">
                  {weekDates.map((date, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center w-[43px] h-[69px] p-3"
                    >
                      <span className={`text-xs mb-2 ${date.active ? 'font-bold text-black' : 'text-gray-500'}`}>
                        {date.day}
                      </span>
                      
                      {date.isPrayer ? (
                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                          {/* Prayer Icon/Emoji for Sunday */}
                          <span role="img" aria-label="prayer">🙏</span>
                        </div>
                      ) : (
                        <div className={`text-sm ${date.active ? 'font-bold text-black' : 'text-gray-800'} ${date.active ? 'bg-[#F1F3F5] rounded-full w-full py-1' : ''}`}>
                          {date.date}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Reading Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">이어보기</h2>
              <div className="space-y-2">
                {typedReadingSchedule.map((schedule) => {
                  // Find the scripture by scriptureId
                  const matchingScripture = Object.values(typedScriptures).find(
                    s => s.id === schedule.scriptureId
                  );
                  
                  if (!matchingScripture || !matchingScripture.hasStarted) return null;

                  const progressColor = matchingScripture.colorScheme?.progressBg || "#FF4D00";
                  
                  return (
                    <div
                      key={schedule.id}
                      className="bg-white p-5 rounded-3xl shadow-sm"
                      onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                    >
                      <div className={`inline-flex px-2 py-2 ${matchingScripture.colorScheme?.bg || 'bg-red-500'} rounded-xl mb-3`}>
                        <span className={`text-xs font-medium ${matchingScripture.colorScheme?.text || 'text-white'}`}>
                          {matchingScripture.title}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-3">
                        보리11님의 {matchingScripture.title} 통독
                      </h3>
                      <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1">
                        <div 
                          className="h-1 rounded-full" 
                          style={{ 
                            width: `${matchingScripture.progress || 0}%`,
                            background: `linear-gradient(90deg, rgba(218, 0, 0, 0.55) 0%, ${progressColor} 44.19%)`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-xs text-gray-500">{matchingScripture.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Scriptures Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">아직 펼치지 않은 이야기</h2>
              <div className="space-y-2">
                {Object.values(typedScriptures).map((scripture) => {
                  // Check if this scripture is already started
                  if (scripture.hasStarted) return null;
                  
                  return (
                    <div
                      key={scripture.id}
                      className="bg-white p-5 rounded-3xl shadow-sm"
                      onClick={() => navigate(`/scripture/${scripture.id}`)}
                    >
                      <div className={`inline-flex px-2 py-2 ${scripture.colorScheme?.bg || 'bg-blue-500'} rounded-xl mb-3`}>
                        <span className={`text-xs font-medium ${scripture.colorScheme?.text || 'text-white'}`}>
                          {scripture.title}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-3">
                        보리11님의 {scripture.title} 통독
                      </h3>
                      <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1"></div>
                      <div className="flex justify-end">
                        <span className="text-xs text-gray-500">0%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div>
            {activeTab === 'calendar' && <ScriptureCalendar />}
            {activeTab === 'bookmark' && <BookmarkList />}
            {activeTab === 'share' && <ShareOptions />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        )}
      </div>

      {/* Scripture Bottom Navigation */}
      {activeTab !== 'reading' && (
        <ScriptureBottomNav 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
};

export default Scripture;
