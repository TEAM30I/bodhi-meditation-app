
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { calendarData } from '@/data/scriptureData/scriptureRepository';

const ScriptureCalendar: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      {/* Calendar Title */}
      <h1 className="text-lg font-bold text-center mb-4">경전 읽기 캘린더</h1>

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">2025년 4월</h2>
        
        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          <div className="text-center text-sm font-medium text-gray-500">일</div>
          <div className="text-center text-sm font-medium text-gray-500">월</div>
          <div className="text-center text-sm font-medium text-gray-500">화</div>
          <div className="text-center text-sm font-medium text-gray-500">수</div>
          <div className="text-center text-sm font-medium text-gray-500">목</div>
          <div className="text-center text-sm font-medium text-gray-500">금</div>
          <div className="text-center text-sm font-medium text-gray-500">토</div>
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          <div className="text-center py-2 text-gray-400">30</div>
          <div className="text-center py-2">1</div>
          <div className="text-center py-2">2</div>
          <div className="text-center py-2 rounded-full bg-orange-100">3</div>
          <div className="text-center py-2 rounded-full bg-orange-100">4</div>
          <div className="text-center py-2">5</div>
          <div className="text-center py-2">6</div>
          
          <div className="text-center py-2 rounded-full bg-orange-100">7</div>
          <div className="text-center py-2">8</div>
          <div className="text-center py-2 rounded-full bg-orange-500 text-white">9</div>
          <div className="text-center py-2">10</div>
          <div className="text-center py-2">11</div>
          <div className="text-center py-2">12</div>
          <div className="text-center py-2">13</div>
          
          <div className="text-center py-2 text-red-500">14</div>
          <div className="text-center py-2">15</div>
          <div className="text-center py-2">16</div>
          <div className="text-center py-2">17</div>
          <div className="text-center py-2">18</div>
          <div className="text-center py-2">19</div>
          <div className="text-center py-2">20</div>
          
          <div className="text-center py-2 text-red-500">21</div>
          <div className="text-center py-2">22</div>
          <div className="text-center py-2">23</div>
          <div className="text-center py-2">24</div>
          <div className="text-center py-2">25</div>
          <div className="text-center py-2">26</div>
          <div className="text-center py-2">27</div>
          
          <div className="text-center py-2 text-red-500">28</div>
          <div className="text-center py-2">29</div>
          <div className="text-center py-2">30</div>
          <div className="text-center py-2">31</div>
          <div className="text-center py-2 text-gray-400">1</div>
          <div className="text-center py-2 text-gray-400">2</div>
          <div className="text-center py-2 text-gray-400">3</div>
        </div>
      </div>

      {/* Current Progress */}
      <h2 className="text-lg font-medium mb-4">현재 진행 중</h2>
      
      {/* Progress Cards */}
      <div className="space-y-4">
        {/* Banya Scripture Card */}
        <div className="bg-white rounded-3xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">반야심경</span>
          </div>
          <p className="text-sm font-medium mb-1">보리[11장]의 반야심경 통독</p>
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{width: '25.5%'}}></div>
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">25.5%</span>
          </div>
        </div>

        {/* Hwaeom Scripture Card */}
        <div className="bg-white rounded-3xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <span className="px-3 py-1 bg-orange-400 text-white text-sm rounded-full">화엄경</span>
          </div>
          <p className="text-sm font-medium mb-1">보리[11장]의 반야심경 통독</p>
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{width: '87.8%'}}></div>
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">87.8%</span>
          </div>
        </div>

        {/* No Data Card */}
        <div className="bg-white rounded-3xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">기록 데이터가 없어요</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureCalendar;
