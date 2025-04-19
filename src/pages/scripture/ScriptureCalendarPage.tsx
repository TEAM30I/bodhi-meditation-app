import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { calendarData, readingSchedule, scriptures } from '../../../public/data/scriptureData/scriptureRepository';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';

const ScriptureCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useAuth();
  const [journeyData, setJourneyData] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  
  const typedCalendarData = typedData<typeof calendarData>(calendarData);
  const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const prevMonthDays = [];
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push(daysInPrevMonth - firstDayOfMonth + i + 1);
  }
  
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  const nextMonthDays = [];
  const totalCells = 42;
  const remainingCells = totalCells - (prevMonthDays.length + days.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(i);
  }
  
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const getReadingDataForDate = (date: number) => {
    const fullDate = new Date(year, month, date);
    const matchingData = typedCalendarData.find(item => 
      item.date.getFullYear() === fullDate.getFullYear() &&
      item.date.getMonth() === fullDate.getMonth() &&
      item.date.getDate() === fullDate.getDate()
    );
    
    return matchingData;
  };
  
  const readingItems = typedReadingSchedule.slice(0, 2).map(schedule => {
    const matchingScripture = Object.values(typedScriptures).find(s => s.id === schedule.scriptureId);
    if (!matchingScripture) return null;
    
    return {
      id: schedule.id,
      title: matchingScripture.title,
      color: matchingScripture.id === 'heart-sutra' ? '#EF4223' :
             matchingScripture.id === 'diamond-sutra' ? '#21212F' :
             matchingScripture.id === 'lotus-sutra' ? '#0080FF' : '#DE7834',
      progress: matchingScripture.progress || 0
    };
  }).filter(Boolean);
  
  const getDayClass = (day: number) => {
    const isToday = day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();
                    
    const hasReading = !!getReadingDataForDate(day);
    
    if (isToday) return "bg-[#DE7834] text-white";
    if (hasReading) return "bg-[#FFD0B0] text-[#111]";
    
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0) return "text-[#E30000]"; // Sunday
    
    return "text-[#111]";
  };

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!user) return;

      try {
        const { data: journeyResults, error: journeyError } = await supabase
          .from('scripture_journey')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (journeyError) throw journeyError;
        setJourneyData(journeyResults || []);

        const { data: progressData, error: progressError } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        setCalendarData(progressData || []);
      } catch (error) {
        console.error('Error fetching journey data:', error);
      }
    };

    fetchJourneyData();
  }, [user]);

  return (
    <PageLayout title="경전 캘린더" showBackButton={true}>
      <div className="w-full max-w-[480px] mx-auto min-h-screen bg-gray-50">
        <div className="p-4 space-y-4">
          {/* 달력 헤더 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <button 
                  onClick={goToPrevMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-bold">
                  {year}년 {monthNames[month]}
                </h2>
                <button 
                  onClick={goToNextMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 bg-gray-50">
              {weekdays.map((day, index) => (
                <div 
                  key={index} 
                  className={`h-10 flex items-center justify-center text-sm font-medium
                    ${index === 0 ? 'text-red-500' : 'text-gray-600'}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 bg-white p-2 gap-1">
              {/* 이전 달 날짜 */}
              {prevMonthDays.map((day, index) => (
                <div 
                  key={`prev-${index}`} 
                  className="aspect-square flex items-center justify-center text-sm text-gray-400"
                >
                  {day}
                </div>
              ))}

              {/* 현재 달 날짜 */}
              {days.map((day, index) => {
                const isToday = day === new Date().getDate() && 
                              month === new Date().getMonth() && 
                              year === new Date().getFullYear();
                const hasReading = !!getReadingDataForDate(day);
                const dayOfWeek = new Date(year, month, day).getDay();
                
                return (
                  <div 
                    key={`current-${index}`} 
                    className={`aspect-square relative flex items-center justify-center text-sm
                      ${isToday ? 'bg-orange-500 text-white rounded-lg' : ''}
                      ${hasReading ? 'bg-orange-50 rounded-lg' : ''}
                      ${dayOfWeek === 0 ? 'text-red-500' : 'text-gray-900'}
                    `}
                  >
                    {day}
                    {hasReading && !isToday && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}

              {/* 다음 달 날짜 */}
              {nextMonthDays.map((day, index) => (
                <div 
                  key={`next-${index}`} 
                  className="aspect-square flex items-center justify-center text-sm text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* 읽기 진행 상황 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">이번 달 읽기 진행</h3>
            <div className="space-y-4">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(calendarData.filter(item => item.completed).length / Math.max(calendarData.length, 1)) * 100}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">진행률</span>
                <span className="font-medium">
                  {calendarData.filter(item => item.completed).length}/{calendarData.length} 일
                </span>
              </div>
            </div>
          </div>

          {/* 최근 독경 기록 */}
          {journeyData.length > 0 && (
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">최근 독경 기록</h3>
              <div className="space-y-3">
                {journeyData.map((journey, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{journey.title}</h4>
                      <p className="text-sm text-gray-500">{new Date(journey.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm font-medium text-orange-500">
                      {journey.duration}분
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ScriptureCalendarPage;
