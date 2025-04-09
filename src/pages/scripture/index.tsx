import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
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
              <ArrowLeft size={28} />
            </button>
            <div className="font-bold text-lg text-[#111]">경전 읽기</div>
          </div>
          
          <button onClick={handleNavigateToBookmark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_55618_334)">
                          <path d="M11.075 2.9001C11.025 2.9001 10.95 2.9001 10.9 2.9251V1.6001C10.9 1.0501 10.45 0.600098 9.9 0.600098C9.475 0.600098 9.125 0.850098 8.975 1.2001C8.825 0.850098 8.475 0.600098 8.05 0.600098C7.5 0.600098 7.05 1.0501 7.05 1.6001V2.9251C7 2.9251 6.925 2.9001 6.875 2.9001C6.325 2.9001 5.875 3.3501 5.875 3.9001V11.8251C5.875 12.3751 6.325 12.8251 6.875 12.8251C7.15 12.8251 7.425 12.7001 7.6 12.5251C7.725 12.6001 7.9 12.6501 8.05 12.6501V12.7001H10.575C10.725 12.7751 10.875 12.8251 11.075 12.8251C11.625 12.8251 12.075 12.3751 12.075 11.8251V3.9001C12.075 3.3501 11.65 2.9001 11.075 2.9001Z" fill="#EDC0A2"/>
                          <path d="M16.675 11.125C16.6 11 16.525 10.9 16.425 10.8C15.55 9.92497 13.725 10.375 12.325 11.775C10.925 13.175 10.475 15.025 11.35 15.875C11.425 15.95 11.475 16 11.55 16.05L13.5 18H17.95L18 12.45L16.675 11.125Z" fill="#357BA8"/>
                          <path d="M15.275 10.625C15.225 10.525 15.15 10.425 15.05 10.35C13.35 8.85005 11.425 6.65005 11.425 5.87505V1.92505C11.425 1.37505 10.975 0.925049 10.425 0.925049C9.875 0.925049 9.425 1.37505 9.425 1.92505V10.05C9.425 13.175 11.25 14.975 11.325 15.05C11.475 15.175 11.675 15.275 11.875 15.325H12.075C12.525 15.325 13.45 15.15 14.575 14.025C15.875 12.75 15.625 11.3 15.275 10.625Z" fill="#FFD3B6"/>
                          <path d="M5.65 11.775C4.25 10.375 2.4 9.92497 1.55 10.8C1.45 10.9 1.375 11 1.3 11.125L-0.0249996 12.45L3.81842e-07 18H4.45L6.4 16.05C6.475 16 6.55 15.95 6.6 15.875C7.5 15 7.05 13.175 5.65 11.775Z" fill="#357BA8"/>
                          <path d="M7.55 0.925049C7 0.925049 6.55 1.37505 6.55 1.92505V5.87505C6.55 6.65005 4.65 8.85005 2.925 10.35C2.825 10.425 2.75 10.525 2.7 10.625C2.35 11.3 2.1 12.75 3.375 14.05C4.5 15.175 5.425 15.35 5.875 15.35H6.075C6.275 15.325 6.475 15.225 6.625 15.075C6.7 15 8.525 13.225 8.525 10.075V1.92505C8.55 1.37505 8.1 0.925049 7.55 0.925049Z" fill="#FFD3B6"/>
                          <path d="M13.625 3.44988C13.65 3.44988 13.65 3.44988 13.675 3.42488L15.45 2.42488C15.475 2.39988 15.5 2.37488 15.5 2.34988C15.5 2.32488 15.5 2.29988 15.475 2.27488L14.7 1.49988C14.675 1.49988 14.65 1.47488 14.6 1.49988C14.575 1.49988 14.55 1.52488 14.525 1.54988L13.525 3.32488C13.5 3.37488 13.5 3.39988 13.55 3.44988H13.625ZM2.625 2.44988L4.4 3.44988C4.425 3.44988 4.425 3.47488 4.45 3.47488C4.525 3.47488 4.55 3.42488 4.55 3.37488C4.55 3.34988 4.55 3.32488 4.525 3.29988L3.55 1.54988C3.525 1.49988 3.5 1.49988 3.475 1.49988C3.45 1.49988 3.425 1.49988 3.4 1.52488L2.625 2.29988C2.6 2.32488 2.6 2.34988 2.6 2.37488C2.6 2.39988 2.6 2.42488 2.625 2.44988ZM15.525 4.67488C15.5 4.64988 15.475 4.64988 15.45 4.64988L13.5 5.19988C13.45 5.19988 13.425 5.24988 13.425 5.29988C13.425 5.34988 13.45 5.37488 13.5 5.39988L15.45 5.94988H15.475C15.5 5.94988 15.525 5.94988 15.525 5.92488C15.55 5.89988 15.575 5.87488 15.575 5.84988V4.74988C15.55 4.72488 15.55 4.67488 15.525 4.67488ZM4.6 5.19988L2.65 4.64988C2.625 4.64988 2.6 4.64988 2.575 4.67488C2.525 4.67488 2.5 4.72488 2.5 4.74988V5.82488C2.5 5.84988 2.525 5.87488 2.55 5.89988C2.575 5.92488 2.6 5.92488 2.6 5.92488H2.625L4.575 5.37488C4.625 5.37488 4.65 5.32488 4.65 5.27488C4.65 5.22488 4.625 5.19988 4.6 5.19988Z" fill="#00BEEA"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_55618_334">
                            <rect width="18" height="18" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
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
          <div className="flex flex-col gap-2">
            {typedReadingSchedule.map((schedule) => {
              // Find the scripture by scriptureId
              const matchingScripture = Object.values(typedScriptures).find(
                s => s.id === schedule.scriptureId
              );
              
              if (!matchingScripture || !matchingScripture.hasStarted) return null;

              const progressColor = matchingScripture.colorScheme?.progressBg || "#DE7834";
              let badgeColor = "#EF4223";
              
              if (matchingScripture.id === "heart-sutra") {
                badgeColor = "#EF4223";
              } else if (matchingScripture.id === "lotus-sutra") {
                badgeColor = "#FFB23F";
              }
              
              return (
                <div
                  key={schedule.id}
                  className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                  onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                >
                  <div className={`inline-flex px-2 py-2 rounded-xl mb-3`} style={{ backgroundColor: badgeColor }}>
                    <span className="text-xs font-medium text-white">
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
        <div className="px-5 mt-6 pb-10">
          <h2 className="text-lg font-bold text-black mb-4">아직 펼치지 않은 이야기</h2>
          <div className="flex flex-col gap-2">
            {Object.values(typedScriptures).map((scripture) => {
              // Check if this scripture is already started
              if (scripture.hasStarted) return null;
              
              let badgeColor = "#21212F";
              
              if (scripture.id === "diamond-sutra") {
                badgeColor = "#21212F";
              } else if (scripture.id === "lotus-sutra") {
                badgeColor = "#0080FF";
              } else if (scripture.id === "sixpatriarch-sutra") {
                badgeColor = "#4CAF50";
              }
              
              return (
                <div
                  key={scripture.id}
                  className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                  onClick={() => navigate(`/scripture/${scripture.id}`)}
                >
                  <div className="inline-flex px-2 py-2 rounded-xl mb-3" style={{ backgroundColor: badgeColor }}>
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
        </div>
      </div>
    </div>
  );
};

export default Scripture;
