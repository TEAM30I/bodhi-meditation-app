
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Search, Settings, Share2, ChevronLeft, ChevronRight, CalendarDays, ChevronDown } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { getScriptureById, updateReadingProgress, addBookmark, Scripture } from '../../../public/data/scriptureData/scriptureRepository';

const ScriptureReader = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'original' | 'explanation'>('original');
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showControls, setShowControls] = useState(true);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  const typedGetScriptureById = typedData<typeof getScriptureById>(getScriptureById);
  const typedUpdateReadingProgress = typedData<typeof updateReadingProgress>(updateReadingProgress);
  const typedAddBookmark = typedData<typeof addBookmark>(addBookmark);
  
  const scripture: Scripture | undefined = id ? typedGetScriptureById(id) : undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (scripture && scripture.hasStarted) {
      const lastChapterIndex = scripture.chapters.findIndex(ch => ch.id === scripture.lastReadChapter);
      if (lastChapterIndex !== -1) {
        setCurrentChapterIndex(lastChapterIndex);
        setCurrentPageIndex(scripture.lastPageIndex || 0);
      }
    }
  }, [scripture]);

  useEffect(() => {
    if (scripture) {
      const progress = ((currentChapterIndex * 100) / scripture.chapters.length) + 
                      ((currentPageIndex * 100) / 10) / scripture.chapters.length;
      
      typedUpdateReadingProgress(
        scripture.id, 
        Math.min(100, progress), 
        scripture.chapters[currentChapterIndex].id,
        currentPageIndex
      );
    }
  }, [currentChapterIndex, currentPageIndex, scripture]);

  if (!scripture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>경전을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const currentChapter = scripture.chapters[currentChapterIndex];
  const content = currentChapter ? (activeTab === 'original' ? currentChapter.original : currentChapter.explanation) : '';
  
  const pageContent = content.split('\n');
  
  const handleBackClick = () => {
    navigate('/scripture');
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPageIndex(4);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < 4) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentChapterIndex < scripture.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentPageIndex(0);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleBookmark = () => {
    typedAddBookmark(
      'user1',
      scripture.id,
      currentChapter.id,
      currentPageIndex,
      `${currentChapter.title} - 페이지 ${currentPageIndex + 1}`
    );
  };
  
  const handleTabChange = (tab: 'original' | 'explanation') => {
    setActiveTab(tab);
  };

  return (
    <div 
      className="min-h-screen bg-white"
      onClick={toggleControls}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 w-full bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button onClick={handleBackClick} className="mr-2 flex items-center">
            <ArrowLeft size={20} />
            <span className="ml-2 text-sm">법화경 <ChevronDown size={16} className="inline" /></span>
          </button>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-3">
            <button onClick={(e) => {
              e.stopPropagation();
              handleBookmark();
            }}>
              <Bookmark size={20} />
            </button>
            <button>
              <Search size={20} />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex w-full">
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === 'original' 
                ? 'text-black border-b-2 border-black font-medium' 
                : 'text-gray-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleTabChange('original');
            }}
          >
            원문
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === 'explanation' 
                ? 'text-black border-b-2 border-black font-medium' 
                : 'text-gray-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleTabChange('explanation');
            }}
          >
            해설
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="pt-[106px] pb-[80px] px-5 overflow-y-auto"
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {currentChapter && (
          <>
            <h2 className="font-bold text-lg mb-4">{currentChapter.title}</h2>
            <div className="mb-4">
              {pageContent.map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Page Navigation Buttons */}
      {showControls && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-between items-center px-5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPage();
            }}
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-800 ${currentChapterIndex === 0 && currentPageIndex === 0 ? 'opacity-50' : ''}`}
            disabled={currentChapterIndex === 0 && currentPageIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleNextPage();
            }}
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-800 ${currentChapterIndex === scripture.chapters.length - 1 && currentPageIndex === 4 ? 'opacity-50' : ''}`}
            disabled={currentChapterIndex === scripture.chapters.length - 1 && currentPageIndex === 4}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
      
      {/* Settings Panel */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 bg-black/50" 
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(false);
          }}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 p-5 bg-white rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-6 text-center">
              경전 설정
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  글자 크기
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">작게</span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-base font-medium text-gray-700">크게</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  줄 간격
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">좁게</span>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    step="1"
                    value={lineHeight * 10}
                    onChange={(e) => setLineHeight(parseInt(e.target.value) / 10)}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">넓게</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">다크 모드</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={() => setDarkMode(!darkMode)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-[#FF4D00] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              
              <button
                className="w-full py-3 rounded-lg bg-[#FF4D00] text-white font-medium"
                onClick={() => setShowSettings(false)}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      {showControls && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-6 z-10">
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/scripture/calendar');
            }}
          >
            <CalendarDays size={22} className="text-gray-700" />
            <span className="text-xs mt-1 text-gray-600">캘린더</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/scripture/bookmark');
            }}
          >
            <Bookmark size={22} className="text-gray-700" />
            <span className="text-xs mt-1 text-gray-600">북마크</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 size={22} className="text-gray-700" />
            <span className="text-xs mt-1 text-gray-600">공유</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(true);
            }}
          >
            <Settings size={22} className="text-gray-700" />
            <span className="text-xs mt-1 text-gray-600">설정</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
