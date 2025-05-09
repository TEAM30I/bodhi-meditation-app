import React from 'react';

/**
 * 현재 주간의 날짜 배열을 생성하는 함수
 * @returns 7일간의 날짜 정보를 담은 배열
 */
const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay(); // 0: 일요일, 1: 월요일, ...
  const dates = [];
  
  // 현재 날짜를 기준으로 그 주의 시작일(일요일)을 계산
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - day);
  
  // 일요일부터 토요일까지 7일의 날짜 생성
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // 날짜 정보 객체 생성
    dates.push({
      date: date.getDate(), // 날짜 (1-31)
      day: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()], // 요일 한글
      active: date.getDate() === today.getDate(), // 오늘 여부
      isPrayer: date.getDay() === 0, // 일요일(기도일) 여부
    });
  }
  
  return dates;
};

/**
 * 경전 캘린더 프리뷰 컴포넌트
 * 한 주의 날짜를 보여주며 현재 날짜와 기도일을 표시합니다.
 */
export const ScriptureCalendarPrev: React.FC = () => {
  const weekDates = getWeekDates();

  return (
    <div className="bg-white rounded-3xl p-3.5 shadow-sm w-full">
      <div className="flex justify-center gap-0.5 overflow-x-auto">
        {weekDates.map((date, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-[43px] h-[69px] p-3"
          >
            <span
              className={`text-xs mb-2 ${
                date.active ? 'font-bold text-black' : 'text-gray-500'
              }`}
            >
              {date.day}
            </span>

            {date.isPrayer ? (
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                {/* Sunday Prayer Icon/Emoji */}
                <span role="img" aria-label="prayer">🙏</span>
              </div>
            ) : (
              <div
                className={`text-sm text-center ${
                  date.active ? 'font-bold text-black' : 'text-gray-800'
                } ${
                  date.active ? 'bg-[#F1F3F5] rounded-full w-full py-1' : ''
                }`}
              >
                {date.date}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};