import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home, Bookmark } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { scriptures, readingSchedule } from '../../../public/data/scriptureData/scriptureRepository';

const Scripture = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Type our data correctly
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calendar days for the week
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  
  // Generate dates for the calendar
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i - today.getDay()); // Show days from Sunday to Saturday
    return {
      day: weekDays[date.getDay()],
      date: date.getDate(),
      active: i === today.getDay(), // Today is active
      isPrayer: i === 0, // Sunday has prayer icon
    };
  });

  const handleBackClick = () => {
    navigate('/main');
  };

  const handleNavigateToCalendar = () => {
    navigate('/scripture/calendar');
  };

  const handleNavigateToBookmark = () => {
    navigate('/scripture/bookmarks');
  };

  // Group scriptures by read status
  const startedScriptures = Object.values(typedScriptures).filter(s => s.hasStarted);
  const notStartedScriptures = Object.values(typedScriptures).filter(s => !s.hasStarted);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F3F5] min-h-screen font-['Pretendard']">
      <div className="flex flex-col w-full max-w-[360px] mx-auto">
        {/* Status Bar */}
        <div className="h-11 px-5 flex items-center justify-between">
          <span className="text-base">9:41</span>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-5">
          <div className="flex items-center gap-4">
            <button onClick={handleBackClick}>
              <Home size={28} />
            </button>
            <div className="font-bold text-lg text-[#111]">경전 읽기</div>
          </div>
          
          <button onClick={handleNavigateToBookmark}>
            <Bookmark size={24} />
          </button>
        </div>
        
        {/* Calendar Section */}
        <div className="px-5 mt-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-black">경전 캘린더</h2>
            <button 
              onClick={handleNavigateToCalendar}
              className="flex items-center gap-0.5 text-xs text-[#767676]"
            >
              더보기
              <ChevronRight size={12} className="text-[#767676]" />
            </button>
          </div>
          
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex gap-0.5">
              {dates.map((date, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center w-[43px] h-[69px] p-3 ${
                    date.active ? 'bg-[#F1F3F5] rounded-full' : ''
                  }`}
                >
                  <span className={`text-xs mb-2 ${
                    date.active ? 'font-bold text-[#111]' : 'text-[#767676]'
                  }`}>
                    {date.day}
                  </span>
                  
                  {date.isPrayer ? (
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <span role="img" aria-label="prayer">🙏</span>
                    </div>
                  ) : (
                    <div className={`text-sm ${date.active ? 'font-bold text-[#111]' : 'text-[#111]'}`}>
                      {date.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Continue Reading Section */}
        <div className="px-5 mt-6">
          <h2 className="text-lg font-bold text-black mb-4">이어보기</h2>
          {startedScriptures.length > 0 ? (
            <div className="flex flex-col gap-2">
              {startedScriptures.map((scripture) => {
                const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                                scripture.id === "diamond-sutra" ? "#21212F" :
                                scripture.id === "lotus-sutra" ? "#0080FF" :
                                scripture.id === "sixpatriarch-sutra" ? "#4CAF50" : "#DE7834";
                
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
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
              <p className="text-gray-500">아직 시작한 경전이 없습니다.</p>
            </div>
          )}
        </div>
        
        {/* Other Scriptures Section */}
        <div className="px-5 mt-6 pb-10">
          <h2 className="text-lg font-bold text-black mb-4">아직 펼치지 않은 이야기</h2>
          {notStartedScriptures.length > 0 ? (
            <div className="flex flex-col gap-2">
              {notStartedScriptures.map((scripture) => {
                const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                                scripture.id === "diamond-sutra" ? "#21212F" :
                                scripture.id === "lotus-sutra" ? "#0080FF" :
                                scripture.id === "sixpatriarch-sutra" ? "#4CAF50" : "#DE7834";
                
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
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
              <p className="text-gray-500">모든 경전을 시작했습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scripture;
