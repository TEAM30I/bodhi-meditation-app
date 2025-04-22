import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { typedData } from '@/utils/typeUtils';
import { getScriptureById, Scripture } from '../../../public/data/scriptureData/scriptureRepository';
import SettingsPanel from '@/components/scripture/SettingsPanel';
import ScriptureHeader from '@/components/scripture/ScriptureHeader';
import ScriptureSearch from '@/components/scripture/ScriptureSearch';
import ScriptureNavigation from '@/components/scripture/ScriptureNavigation';
import PageNavigation from '@/components/scripture/PageNavigation';

const ScriptureReader = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'original' | 'explanation'>('explanation');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState<'gothic' | 'serif'>('gothic');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{index: number, text: string}[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  
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
      
      if (results.length > 0) {
        highlightSearchResult(0);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, scripture]);

  if (!scripture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>경전을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPageIndex(4);
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

  const handleTabChange = (tab: 'original' | 'explanation') => {
    setActiveTab(tab);
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

  const highlightSearchResult = (index: number) => {
    if (searchResults.length === 0) return;
    
    setCurrentSearchIndex(index);
    
    const resultText = searchResults[index].text;
    const chapterIndex = scripture.chapters.findIndex(chapter => 
      chapter.original?.includes(resultText) || chapter.explanation?.includes(resultText)
    );
    
    if (chapterIndex !== -1) {
      setCurrentChapterIndex(chapterIndex);
      setCurrentPageIndex(0);
    }
    
    setTimeout(() => {
      const resultElement = document.getElementById(`search-result-${index}`);
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const renderContent = () => {
    if (!scripture.content) return null;
    
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

  const currentChapter = scripture.chapters[currentChapterIndex];
  const contentClasses = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
  const fontFamilyClasses = fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  
  const isFirstPage = currentChapterIndex === 0 && currentPageIndex === 0;
  const isLastPage = currentChapterIndex === scripture.chapters.length - 1 && currentPageIndex === 4;

  return (
    <div 
      className={`min-h-screen ${contentClasses} font-['Pretendard']`}
      onClick={toggleControls}
    >
      <ScriptureHeader 
        scripture={scripture}
        currentChapterIndex={currentChapterIndex}
        theme={theme}
        showChapterDropdown={showChapterDropdown}
        onSearchToggle={toggleSearch}
        onChapterDropdownToggle={toggleChapterDropdown}
        onChapterSelect={selectChapter}
      />
      
      {showSearch && (
        <ScriptureSearch 
          theme={theme}
          searchQuery={searchQuery}
          onSearchChange={handleSearchQueryChange}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          onNavigateSearch={navigateSearchResult}
        />
      )}
      
      <div className="flex px-8 py-4 gap-2">
        <button
          className={`flex-1 h-11 flex items-center justify-center rounded-3xl text-sm ${
            activeTab === 'original' 
              ? 'bg-[#21212F] text-white font-bold' 
              : `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#EDEDED]'} border ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`
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
              : `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#EDEDED]'} border ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleTabChange('explanation');
          }}
        >
          해석본
        </button>
      </div>
      
      <div 
        ref={contentRef}
        className={`px-10 py-4 overflow-y-auto ${contentClasses} ${fontFamilyClasses}`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: '1.6',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {currentChapter && (
          <>
            <h2 className={`font-bold text-xl mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {currentChapter.title}
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mb-8`}>
              {activeTab === 'original' ? '원문' : '해설'} - 페이지 {currentPageIndex + 1}
            </p>
            <div className="mb-4">
              {renderContent()}
            </div>
          </>
        )}
      </div>

      <PageNavigation 
        theme={theme}
        showControls={showControls}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
      
      <ScriptureNavigation 
        theme={theme}
        onSettingsClick={(e) => {
          e.stopPropagation();
          setShowSettings(true);
        }}
        showControls={showControls}
      />
      
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
            <SettingsPanel 
              onFontSizeChange={setFontSize}
              onFontFamilyChange={setFontFamily}
              onThemeChange={setTheme}
              initialFontSize={Math.round((fontSize / 16) * 100)}
              initialFontFamily={fontFamily}
              initialTheme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
