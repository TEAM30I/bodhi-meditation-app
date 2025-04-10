
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Share2, ChevronLeft, ChevronRight, ChevronDown, Calendar, Home } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { getScriptureById, Scripture } from '../../../public/data/scriptureData/scriptureRepository';
import SettingsPanel from '@/components/scripture/SettingsPanel';
import { ShareOptions } from '@/components/scripture/ShareOptions';
import SharedScripture from '@/components/scripture/SharedScripture';

const ScriptureReader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'original' | 'explanation'>('explanation');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState<'gothic' | 'serif'>('gothic');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showControls, setShowControls] = useState(true);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{index: number, text: string}[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showShare, setShowShare] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  const typedGetScriptureById = typedData<typeof getScriptureById>(getScriptureById);
  
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
      
      if (scripture.updateReadingProgress) {
        scripture.updateReadingProgress(
          scripture.id, 
          Math.min(100, progress), 
          scripture.chapters[currentChapterIndex].id,
          currentPageIndex
        );
      }
    }
  }, [currentChapterIndex, currentPageIndex, scripture]);

  useEffect(() => {
    // Apply theme changes to the content area
    if (contentRef.current) {
      if (theme === 'dark') {
        contentRef.current.classList.add('bg-gray-900', 'text-white');
        contentRef.current.classList.remove('bg-white', 'text-gray-800');
      } else {
        contentRef.current.classList.add('bg-white', 'text-gray-800');
        contentRef.current.classList.remove('bg-gray-900', 'text-white');
      }
    }
  }, [theme]);

  useEffect(() => {
    // Apply font family changes
    if (contentRef.current) {
      if (fontFamily === 'serif') {
        contentRef.current.classList.add('font-serif');
        contentRef.current.classList.remove('font-sans');
      } else {
        contentRef.current.classList.add('font-sans');
        contentRef.current.classList.remove('font-serif');
      }
    }
  }, [fontFamily]);

  useEffect(() => {
    if (searchQuery && scripture) {
      const results: {index: number, text: string}[] = [];
      
      // Search in both original and explanation content
      const allContent = [
        ...(scripture.content?.original || []),
        ...(scripture.content?.explanation || [])
      ];
      
      allContent.forEach((text, index) => {
        if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ index, text });
        }
      });
      
      setSearchResults(results);
      setCurrentSearchIndex(0);
      
      // Scroll to the first result if found
      if (results.length > 0) {
        highlightSearchResult(0);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, scripture]);

  const handleBackClick = () => {
    // Go back to previous page instead of always redirecting to /scripture
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate('/main');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(true);
  };

  if (!scripture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>경전을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const currentChapter = scripture.chapters[currentChapterIndex];
  
  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPageIndex(4); // Assuming each chapter has 5 pages (0-4)
    }
    window.scrollTo(0, 0);
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPageIndex < 4) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentChapterIndex < scripture.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentPageIndex(0);
    }
    window.scrollTo(0, 0);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scripture.addBookmark) {
      scripture.addBookmark(
        'user1',
        scripture.id,
        currentChapter.id,
        currentPageIndex,
        `${currentChapter.title} - 페이지 ${currentPageIndex + 1}`
      );
    }
  };
  
  const handleTabChange = (tab: 'original' | 'explanation') => {
    setActiveTab(tab);
  };

  const handleNavigateToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/scripture/calendar');
  };

  const handleNavigateToBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/scripture/bookmarks');
  };

  const toggleChapterDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChapterDropdown(!showChapterDropdown);
  };

  const selectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setCurrentPageIndex(0);
    setShowChapterDropdown(false);
    window.scrollTo(0, 0);
  };

  const toggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const highlightSearchResult = (index: number) => {
    if (searchResults.length === 0) return;
    
    setCurrentSearchIndex(index);
    
    // Calculate which chapter and page this result is on
    // This is a simplification - you'd need to map result indices to actual chapters/pages
    const resultText = searchResults[index].text;
    const chapterIndex = scripture.chapters.findIndex(chapter => 
      chapter.original?.includes(resultText) || chapter.explanation?.includes(resultText)
    );
    
    if (chapterIndex !== -1) {
      setCurrentChapterIndex(chapterIndex);
      setCurrentPageIndex(0); // Reset to first page of that chapter
      
      // You may need a more sophisticated approach to determine the exact page
    }
    
    // Scroll to the element containing the search result
    setTimeout(() => {
      const resultElement = document.getElementById(`search-result-${index}`);
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const navigateSearchResult = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    }
    
    highlightSearchResult(newIndex);
  };

  const renderContent = () => {
    if (!scripture.content) return null;
    
    // Calculate start and end indices for the current page
    const contentArray = activeTab === 'original' 
      ? scripture.content.original 
      : scripture.content.explanation;
    
    if (!contentArray || contentArray.length === 0) {
      return <p className="mb-6 text-gray-600 leading-relaxed">내용이 없습니다.</p>;
    }
    
    const itemsPerPage = 1;
    const startIdx = currentPageIndex * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, contentArray.length);
    
    return contentArray.slice(startIdx, endIdx).map((paragraph, idx) => {
      // If search is active, highlight the search terms
      if (searchQuery && searchResults.length > 0) {
        const parts = paragraph.split(new RegExp(`(${searchQuery})`, 'gi'));
        return (
          <p 
            key={idx} 
            className="mb-6 leading-relaxed"
            id={searchResults.some(r => r.text === paragraph) ? 
              `search-result-${searchResults.findIndex(r => r.text === paragraph)}` : undefined}
          >
            {parts.map((part, i) => 
              part.toLowerCase() === searchQuery.toLowerCase() ? 
              <mark key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</mark> : 
              part
            )}
          </p>
        );
      }
      
      return (
        <p key={idx} className="mb-6 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  const contentClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-800';
  
  const fontFamilyClasses = fontFamily === 'serif' 
    ? 'font-serif' 
    : 'font-sans';

  // If showShare is true, render the share screen using our dedicated component
  if (showShare && scripture && id) {
    return (
      <SharedScripture 
        scriptureId={scripture.id}
        chapterId={currentChapter.id}
        title={`${scripture.title} - ${currentChapter.title}`}
        theme={theme}
        onClose={() => setShowShare(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
        <button onClick={handleBackClick} className="text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">{scripture.title} - {currentChapter.title}</h1>
        <div className="flex gap-2">
          <button onClick={toggleSearch} className="text-gray-700">
            <Search size={20} />
          </button>
          <button onClick={handleShareClick} className="text-gray-700">
            <Share2 size={20} />
          </button>
          <button onClick={handleHomeClick} className="text-gray-700">
            <Home size={20} />
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      {showSearch && (
        <div className="px-5 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateSearchResult('prev')}
                  className="p-1 text-sm text-blue-600 border border-blue-300 rounded"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-gray-600">
                  {currentSearchIndex + 1}/{searchResults.length}
                </span>
                <button
                  onClick={() => navigateSearchResult('next')}
                  className="p-1 text-sm text-blue-600 border border-blue-300 rounded"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chapter selection dropdown */}
      {showChapterDropdown && (
        <div className="absolute left-0 right-0 z-10 px-5 py-2 mt-2 bg-white border-t border-b border-gray-200">
          <h3 className="mb-2 font-medium">장 선택</h3>
          <div className="max-h-48 overflow-y-auto">
            {scripture.chapters.map((chapter, idx) => (
              <div
                key={chapter.id}
                className={`px-3 py-2 cursor-pointer rounded-md ${
                  currentChapterIndex === idx ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => selectChapter(idx)}
              >
                {chapter.title}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div
        ref={contentRef}
        className={`flex-1 p-5 overflow-y-auto ${contentClasses} ${fontFamilyClasses}`}
        style={{ fontSize: `${fontSize}px`, lineHeight }}
        onClick={toggleControls}
      >
        {/* Tab navigation */}
        <div className="flex gap-4 mb-4 pb-2 border-b border-gray-200">
          <button
            className={`pb-2 font-medium ${
              activeTab === 'original'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('original')}
          >
            원문
          </button>
          <button
            className={`pb-2 font-medium ${
              activeTab === 'explanation'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('explanation')}
          >
            해설
          </button>
        </div>
        
        {/* Chapter title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">{currentChapter.title}</h2>
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={toggleChapterDropdown}
              className="flex items-center text-sm text-gray-500"
            >
              장 선택 <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="mb-20">
          {renderContent()}
        </div>
      </div>
      
      {/* Bottom controls */}
      {showControls && (
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between mx-auto max-w-screen-md">
            <button
              onClick={handlePrevPage}
              className="p-2 text-gray-500 hover:text-gray-700"
              disabled={currentChapterIndex === 0 && currentPageIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNavigateToCalendar}
                className="p-2 text-gray-600"
              >
                <Calendar size={20} />
              </button>
              
              <button
                onClick={handleBookmark}
                className="p-2 text-gray-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            
            <button
              onClick={handleNextPage}
              className="p-2 text-gray-500 hover:text-gray-700"
              disabled={
                currentChapterIndex === scripture.chapters.length - 1 &&
                currentPageIndex >= 4
              }
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
      
      {/* Settings panel */}
      {showSettings && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50">
          <div className="absolute bottom-0 w-full bg-white rounded-t-xl">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">설정</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-500"
                >
                  ✕
                </button>
              </div>
              
              <SettingsPanel
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                theme={theme}
                setTheme={setTheme}
                lineHeight={lineHeight}
                setLineHeight={setLineHeight}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
