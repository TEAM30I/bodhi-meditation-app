import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { scriptures, readingSchedule } from '../../../public/data/scriptureData/scriptureRepository';
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

  // Group scriptures by read status
  const startedScriptures = Object.values(typedScriptures).filter(s => s.hasStarted);
  const notStartedScriptures = Object.values(typedScriptures).filter(s => !s.hasStarted);

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
        <button
          onClick={() => navigate('/scripture/bookmarks')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
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
                {startedScriptures.length > 0 ? (
                  startedScriptures.map((scripture) => {
                    const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                                    scripture.id === "diamond-sutra" ? "#21212F" :
                                    scripture.id === "lotus-sutra" ? "#0080FF" :
                                    scripture.id === "sixpatriarch-sutra" ? "#4CAF50" :
                                    scripture.id === "avatamsaka-sutra" ? "#FFB23F" : "#DE7834";
                    
                    return (
                      <div
                        key={scripture.id}
                        className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                        onClick={() => navigate(`/scripture/${scripture.id}`)}
                      >
                        <div 
                          className="inline-flex px-2 py-2 rounded-xl mb-3"
                          style={{ backgroundColor: badgeColor }}
                        >
                          <span className="text-xs font-medium text-white">
                            {scripture.title}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-3">
                          보리11님의 {scripture.title} 통독
                        </h3>
                        <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1">
                          <div 
                            className="h-1 rounded-full" 
                            style={{ 
                              width: `${scripture.progress || 0}%`,
                              background: `linear-gradient(90deg, rgba(218, 0, 0, 0.55) 0%, ${badgeColor} 44.19%)`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-end">
                          <span className="text-xs text-gray-500">{scripture.progress}%</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                    <p className="text-gray-500">아직 시작한 경전이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Other Scriptures Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">아직 펼치지 않은 이야기</h2>
              <div className="space-y-2">
                {notStartedScriptures.length > 0 ? (
                  notStartedScriptures.map((scripture) => {
                    const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                                    scripture.id === "diamond-sutra" ? "#21212F" :
                                    scripture.id === "lotus-sutra" ? "#0080FF" :
                                    scripture.id === "sixpatriarch-sutra" ? "#4CAF50" :
                                    scripture.id === "avatamsaka-sutra" ? "#FFB23F" : "#DE7834";
                    
                    return (
                      <div
                        key={scripture.id}
                        className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                        onClick={() => navigate(`/scripture/${scripture.id}`)}
                      >
                        <div 
                          className="inline-flex px-2 py-2 rounded-xl mb-3"
                          style={{ backgroundColor: badgeColor }}
                        >
                          <span className="text-xs font-medium text-white">
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
                  })
                ) : (
                  <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                    <p className="text-gray-500">모든 경전을 시작했습니다.</p>
                  </div>
                )}
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
      <ScriptureBottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default Scripture;
