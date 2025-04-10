import React from 'react';

// 요일 문자열 배열
const days = ['일', '월', '화', '수', '목', '금', '토'];

// 주간 날짜 계산 함수
const getWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    // 이번 주 일요일 기준으로 i칸 이동
    date.setDate(today.getDate() - currentDay + i);

    const isToday = i === currentDay;

    dates.push({
      day: days[i],         // 예: '일', '월'
      date: date.getDate(), // 실제 날짜 (예: 10, 11, 12...)
      active: isToday,      // 오늘인지 여부
      isPrayer: i === 0,    // i === 0이면 일요일 → 기도 아이콘
    });
  }

  return dates;
};

// ---------------------------
// React 컴포넌트로 export 예시
// ---------------------------
export const ScriptureCalendarPrev: React.FC = () => {
  const weekDates = getWeekDates();

  return (
    <div className="bg-white rounded-3xl p-3.5 shadow-sm">
      <div className="flex gap-0.5 overflow-x-auto">
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
                className={`text-sm ${
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
