
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Settings, Search, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { getScriptureById, updateReadingProgress, addBookmark, Scripture } from '@/data/scriptureData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  
  const scripture: Scripture | undefined = id ? getScriptureById(id) : undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load the last read position if available
    if (scripture && scripture.hasStarted) {
      const lastChapterIndex = scripture.chapters.findIndex(ch => ch.id === scripture.lastReadChapter);
      if (lastChapterIndex !== -1) {
        setCurrentChapterIndex(lastChapterIndex);
        setCurrentPageIndex(scripture.lastPageIndex || 0);
      }
    }
  }, [scripture]);

  // Save reading progress
  useEffect(() => {
    if (scripture) {
      const progress = ((currentChapterIndex * 100) / scripture.chapters.length) + 
                      ((currentPageIndex * 100) / 10) / scripture.chapters.length;
      
      updateReadingProgress(
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
  
  // Simulate page content
  const pageContent = content.split('\n');
  
  const handleBackClick = () => {
    navigate('/scripture');
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPageIndex(4); // Assume 5 pages per chapter
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < 4) { // Assume 5 pages per chapter
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
    addBookmark(
      'user1', // Default user ID
      scripture.id,
      currentChapter.id,
      currentPageIndex,
      `${currentChapter.title} - 페이지 ${currentPageIndex + 1}`
    );
  };

  return (
    <div 
      className={`min-h-screen ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}
      onClick={toggleControls}
    >
      {/* Header - Only show when controls are visible */}
      {showControls && (
        <div className={`fixed top-0 left-0 right-0 z-10 w-full h-[56px] flex items-center px-5 ${darkMode ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-b border-gray-200'}`}>
          <button onClick={handleBackClick} className="mr-2">
            <ArrowLeft size={22} className={darkMode ? 'text-white' : 'text-black'} />
          </button>
          
          <div className="flex-1 flex items-center">
            <h1 className={`text-base font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
              {scripture.title}
            </h1>
            <ChevronLeft size={16} className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={(e) => {
              e.stopPropagation();
              handleBookmark();
            }}>
              <Bookmark size={20} className={darkMode ? 'text-white' : 'text-black'} />
            </button>
            <button>
              <Search size={20} className={darkMode ? 'text-white' : 'text-black'} />
            </button>
          </div>
        </div>
      )}
      
      {/* Tab switcher - Only show when controls are visible */}
      {showControls && (
        <div className={`fixed top-[56px] left-0 right-0 z-10 w-full flex ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === 'original' 
                ? darkMode ? 'text-white border-b-2 border-[#DE7834]' : 'text-black border-b-2 border-[#DE7834]' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('original');
            }}
          >
            원문
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === 'explanation' 
                ? darkMode ? 'text-white border-b-2 border-[#DE7834]' : 'text-black border-b-2 border-[#DE7834]' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('explanation');
            }}
          >
            해설문
          </button>
        </div>
      )}
      
      {/* Content with proper padding for fixed headers/footers */}
      <div 
        ref={contentRef}
        className={`${darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-white text-black'} pt-[120px] pb-[100px] px-5`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight
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
              <p className="text-right text-sm mt-6">
                페이지 {currentPageIndex + 1}/5 • 장 {currentChapterIndex + 1}/{scripture.chapters.length}
              </p>
            </div>
          </>
        )}
      </div>
      
      {/* Page navigation buttons - Only show when controls are visible */}
      {showControls && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-between items-center px-5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPage();
            }}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            } ${currentChapterIndex === 0 && currentPageIndex === 0 ? 'opacity-50' : ''}`}
            disabled={currentChapterIndex === 0 && currentPageIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleNextPage();
            }}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            } ${currentChapterIndex === scripture.chapters.length - 1 && currentPageIndex === 4 ? 'opacity-50' : ''}`}
            disabled={currentChapterIndex === scripture.chapters.length - 1 && currentPageIndex === 4}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
      
      {/* Settings panel */}
      {showSettings && (
        <div 
          className={`fixed inset-0 z-50 ${darkMode ? 'bg-black/80' : 'bg-black/50'}`} 
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(false);
          }}
        >
          <div 
            className={`absolute bottom-0 left-0 right-0 p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
              경전 설정
            </h3>
            
            {/* Settings content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  글자 크기: {fontSize}px
                </label>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>작게</span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className={`text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>크게</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  줄 간격: {lineHeight.toFixed(1)}
                </label>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>좁게</span>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    step="1"
                    value={lineHeight * 10}
                    onChange={(e) => setLineHeight(parseInt(e.target.value) / 10)}
                    className="flex-1"
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>넓게</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>다크 모드</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={() => setDarkMode(!darkMode)} 
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${darkMode ? 'bg-[#DE7834]' : 'bg-gray-200'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
              
              <Button
                className={`w-full py-3 rounded-lg ${
                  darkMode ? 'bg-[#DE7834] text-white' : 'bg-[#DE7834] text-white'
                } font-medium`}
                onClick={() => setShowSettings(false)}
              >
                적용하기
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation - Only show when controls are visible */}
      {showControls && (
        <div className={`fixed bottom-0 left-0 right-0 h-16 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-around px-6 z-10`}>
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/scripture/calendar');
            }}
          >
            <CalendarDays size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>캘린더</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleBookmark();
            }}
          >
            <Bookmark size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>북마크</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>공유</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(true);
            }}
          >
            <Settings size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>설정</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
