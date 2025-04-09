
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Search, Share2, ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { getScriptureById, updateReadingProgress, addBookmark, Scripture } from '../../../public/data/scriptureData/scriptureRepository';

const ScriptureReader = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'original' | 'explanation'>('explanation');
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

  const handleNavigateToCalendar = () => {
    navigate('/scripture/calendar');
  };

  const handleNavigateToBookmark = () => {
    navigate('/scripture/bookmark');
  };

  return (
    <div 
      className="min-h-screen bg-white font-['Pretendard']"
      onClick={toggleControls}
    >
      {/* Status Bar */}
      <div className="h-11 px-5 flex items-center justify-between">
        <span className="text-base">9:41</span>
      </div>
      
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <button onClick={handleBackClick}>
              <ArrowLeft size={28} />
            </button>
            <div className="flex items-center">
              <span className="font-bold text-lg">{scripture.title}</span>
              <ChevronDown size={20} />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={handleBookmark}>
              <Bookmark size={24} />
            </button>
            <button>
              <Search size={24} />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-8 py-4 gap-2">
          <button
            className={`flex-1 h-11 flex items-center justify-center rounded-3xl text-sm ${
              activeTab === 'original' 
                ? 'bg-white border border-[#EDEDED]' 
                : 'bg-[#21212F] text-white font-bold'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleTabChange('original');
            }}
          >
            원문
          </button>
          <button
            className={`flex-1 h-11 flex items-center justify-center rounded-3xl text-sm ${
              activeTab === 'explanation' 
                ? 'bg-[#21212F] text-white font-bold' 
                : 'bg-white border border-[#EDEDED]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleTabChange('explanation');
            }}
          >
            해석본
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="px-10 py-4 overflow-y-auto"
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {currentChapter && (
          <>
            <h2 className="font-bold text-xl mb-3">{currentChapter.title}</h2>
            <p className="text-gray-500 mb-8">부처님/보살 등장 및 설정</p>
            <div className="mb-4 text-gray-600 leading-relaxed">
              {pageContent.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Page Navigation Buttons */}
      {showControls && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center">
          <div className="flex justify-between w-[270px]">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPage();
              }}
              className="w-[53px] h-[53px] flex items-center justify-center rounded-full bg-white shadow-md"
              disabled={currentChapterIndex === 0 && currentPageIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNextPage();
              }}
              className="w-[53px] h-[53px] flex items-center justify-center rounded-full bg-white shadow-md"
              disabled={currentChapterIndex === scripture.chapters.length - 1 && currentPageIndex === 4}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      {showControls && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center">
          <div className="flex items-center justify-between px-3 h-14 bg-white/80 backdrop-blur-md shadow-lg rounded-full mx-8">
            <button 
              className="w-[67px] h-14 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToCalendar();
              }}
            >
              <Calendar size={28} />
            </button>
            
            <button 
              className="w-[67px] h-14 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToBookmark();
              }}
            >
              <Bookmark size={28} />
            </button>
            
            <button 
              className="w-[67px] h-14 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 size={28} />
            </button>
            
            <button 
              className="w-[67px] h-14 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(true);
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 9.33301C11.4227 9.33301 9.33334 11.4223 9.33334 13.9997C9.33334 16.577 11.4227 18.6663 14 18.6663C16.5774 18.6663 18.6667 16.577 18.6667 13.9997C18.6667 11.4223 16.5774 9.33301 14 9.33301Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M19.0467 21.7004L17.64 20.2938C17.4467 20.1004 17.15 20.0671 16.9217 20.2004L16.8067 20.2704C16.5667 20.4104 16.24 20.3304 16.1 20.0904C15.7067 19.3071 15.4167 18.4638 15.24 17.5771C15.1867 17.3004 15.3667 17.0371 15.65 16.9838L15.785 16.9538C16.0567 16.9004 16.24 16.6604 16.24 16.3888V14.9654C16.24 14.6821 16.0567 14.4538 15.785 14.4004L15.65 14.3704C15.3667 14.3171 15.1867 14.0538 15.24 13.7771C15.4167 12.8788 15.7067 12.0354 16.1 11.2638C16.24 11.0238 16.5667 10.9438 16.8067 11.0838L16.9217 11.1538C17.15 11.2871 17.4467 11.2538 17.64 11.0604L19.0467 9.65375C19.3067 9.39375 19.3067 8.98042 19.0467 8.72042L18.8883 8.56209C18.6983 8.37209 18.6633 8.07542 18.8067 7.85209L18.8767 7.73709C19.0167 7.49709 18.9367 7.17042 18.6967 7.03042C17.9233 6.63042 17.07 6.34042 16.1833 6.16375C15.9067 6.11042 15.6433 6.29042 15.59 6.57375L15.56 6.70876C15.5067 6.98042 15.2667 7.16375 14.995 7.16375H13.5833C13.3 7.16375 13.0717 6.98042 13.0183 6.70876L12.9883 6.57375C12.935 6.29042 12.6717 6.11042 12.395 6.16375C11.4967 6.34042 10.6533 6.63042 9.88167 7.03042C9.64168 7.17042 9.56168 7.49709 9.70168 7.73709L9.77168 7.85209C9.90502 8.07542 9.87168 8.37209 9.68168 8.56209L9.52334 8.72042C9.26334 8.98042 9.26334 9.39375 9.52334 9.65375L10.93 11.0604C11.1233 11.2538 11.42 11.2871 11.6483 11.1538L11.7633 11.0838C12.0033 10.9438 12.33 11.0238 12.47 11.2638C12.8633 12.0471 13.1533 12.8904 13.33 13.7771C13.3833 14.0538 13.2033 14.3171 12.92 14.3704L12.785 14.4004C12.5133 14.4538 12.33 14.6938 12.33 14.9654V16.3888C12.33 16.6721 12.5133 16.9004 12.785 16.9538L12.92 16.9838C13.2033 17.0371 13.3833 17.3004 13.33 17.5771C13.1533 18.4754 12.8633 19.3188 12.47 20.0904C12.33 20.3304 12.0033 20.4104 11.7633 20.2704L11.6483 20.2004C11.42 20.0671 11.1233 20.1004 10.93 20.2938L9.52334 21.7004C9.26334 21.9604 9.26334 22.3738 9.52334 22.6338L9.68168 22.7921C9.87168 22.9821 9.90502 23.2788 9.77168 23.5021L9.70168 23.6171C9.56168 23.8571 9.64168 24.1838 9.88167 24.3238C10.655 24.7238 11.5083 25.0138 12.395 25.1904C12.6717 25.2438 12.935 25.0638 12.9883 24.7804L13.0183 24.6454C13.0717 24.3738 13.3117 24.1904 13.5833 24.1904H14.995C15.2783 24.1904 15.5067 24.3738 15.56 24.6454L15.59 24.7804C15.6433 25.0638 15.9067 25.2438 16.1833 25.1904C17.0817 25.0138 17.925 24.7238 18.6967 24.3238C18.9367 24.1838 19.0167 23.8571 18.8767 23.6171L18.8067 23.5021C18.6733 23.2788 18.7067 22.9821 18.8967 22.7921L19.055 22.6338C19.3067 22.3738 19.3067 21.9604 19.0467 21.7004Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Settings Panel */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-end" 
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(false);
          }}
        >
          <div 
            className="w-full p-5 bg-white rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
