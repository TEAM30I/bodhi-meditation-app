
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { 
  scriptureCategories, 
  scriptures, 
  calendarData,
  readingSchedule 
} from "@/data/scriptureRepository";

const Scripture = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentScriptureId, setCurrentScriptureId] = useState(scriptures[0].id);

  const currentScripture = scriptures.find(s => s.id === currentScriptureId) || scriptures[0];

  return (
    <PageLayout title="경전 읽기 캘린더">
      {activeTab === 'calendar' ? (
        <div className="w-full max-w-4xl mx-auto">
          {/* Date Display */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {calendarData.weekdays.map((day, index) => (
                  <div key={index} className="w-8 h-8 flex items-center justify-center text-sm">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Day Info */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-sm font-medium text-gray-800">
              {calendarData.currentMonth} {calendarData.selectedDate}일 화요일
            </div>
            <div className="text-xs text-gray-500 mt-1">
              오늘의 경전 스케줄을 완료하세요
            </div>
          </div>

          {/* Reading Schedule */}
          <div className="space-y-4">
            {readingSchedule.map((reading) => (
              <div 
                key={reading.id}
                className="flex items-center"
              >
                <div className={`${reading.color} w-16 h-10 rounded-md flex items-center justify-center ${reading.textColor}`}>
                  <span className="text-xs font-bold">{reading.category}</span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-bold text-gray-800">{reading.title}</h3>
                  <p className="text-xs text-gray-500">{reading.chapter}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  시작하기 &gt;
                </Button>
              </div>
            ))}
          </div>

          {/* Calendar Button */}
          <Button
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800"
            onClick={() => setActiveTab('scripture')}
          >
            4월 캘린더 보기 &gt;
          </Button>
        </div>
      ) : activeTab === 'scripture' ? (
        <div className="w-full max-w-4xl mx-auto">
          {/* Scripture Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center">
              <ChevronLeft className="h-5 w-5 mr-1" onClick={() => setActiveTab('calendar')} />
              반야심경
              <ChevronDown className="h-5 w-5 ml-1" />
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <BookmarkIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 mb-6">
            {scriptureCategories.map((category) => (
              <Badge
                key={category.id}
                variant={category.active ? "default" : "outline"}
                className={`rounded-full px-4 py-1 ${
                  category.active ? "bg-black text-white" : "bg-white text-black border-gray-300"
                }`}
              >
                {category.label}
              </Badge>
            ))}
          </div>

          {/* Scripture Content */}
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">1. 개경 (開經)</h3>
            <div className="text-sm leading-6 whitespace-pre-line">
              {currentScripture.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="outline" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          {/* Calendar View */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">2025년 4월</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {calendarData.weekdays.map((day, index) => (
                <div key={index} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarData.days.map((day, index) => (
                <div 
                  key={index} 
                  className={`
                    aspect-square flex items-center justify-center rounded-full text-sm
                    ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                    ${day.isWeekend ? 'text-red-500' : ''}
                    ${day.isSelected ? 'bg-orange-500 text-white' : ''}
                    ${day.isHighlighted && !day.isSelected ? 'bg-orange-100' : ''}
                  `}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full mt-4"
            onClick={() => setActiveTab('calendar')}
          >
            돌아가기
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

// Icons
const ChevronDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export default Scripture;
