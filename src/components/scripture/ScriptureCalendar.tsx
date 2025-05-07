import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { typedData } from '../../utils/typeUtils';
import { getCalendarData } from '../../lib/repository';
import { useAuth } from '../../hooks/useAuth';

// CalendarItem 타입 정의
interface CalendarItem {
  date: Date;
  scriptureId: string;
  progress: number;
  completed: boolean;
  title?: string; // 옵션 필드 추가
}

export const ScriptureCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 실제 API에서 데이터 가져오기
  useEffect(() => {
    const fetchCalendarData = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getCalendarData(user.id);
          
          // 타이틀 필드 추가
          const enhancedData = data.map(item => ({
            ...item,
            title: `경전 읽기 ${new Date(item.date).getDate()}일`
          }));
          
          setCalendarData(enhancedData);
        } catch (error) {
          console.error('Error fetching calendar data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // 사용자가 로그인하지 않은 경우 빈 배열 설정
        setCalendarData([]);
        setLoading(false);
      }
    };
    
    fetchCalendarData();
  }, [user]);
  
  // Get today's date and calculate the week
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Filter calendar data for the current month
  const thisMonthData = calendarData.filter(item => {
    const itemDate = new Date(item.date);
    const itemMonth = itemDate.getMonth();
    const itemYear = itemDate.getFullYear();
    return itemMonth === currentMonth && itemYear === currentYear;
  });
  
  // Calculate progress
  const totalDays = thisMonthData.length;
  const completedDays = thisMonthData.filter(item => item.completed).length;
  const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  
  // Format today's date
  const formattedDate = `${currentYear}.${(currentMonth + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;
  
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">캘린더</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <p className="text-center py-4">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">캘린더</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">{formattedDate}</h3>
          <button 
            className="text-sm text-blue-600"
            onClick={() => navigate('/scripture/calendar')}
          >
            전체 캘린더 보기
          </button>
        </div>
        
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">
          이번 달 경전 읽기: {completedDays}/{totalDays} 일
        </p>
        
        {thisMonthData.length > 0 ? (
          <div className="space-y-3">
            {thisMonthData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                <div className="flex-1">
                  <p className="text-sm">{item.title}</p>
                  <div className="flex items-center">
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{item.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center text-gray-500 py-2">
            이번 달 읽기 기록이 없습니다
          </p>
        )}
      </div>
      
      <button 
        className="w-full py-3 bg-gray-100 rounded-lg text-center text-gray-700 text-sm"
        onClick={() => navigate('/scripture/calendar')}
      >
        <Calendar className="inline-block mr-2 h-4 w-4" />
        달력으로 보기
      </button>
    </div>
  );
};
