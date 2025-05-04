import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { getScriptureById, Scripture } from '@/utils/repository';
import { useScriptureProgress } from '@/hooks/useScriptureProgress';
import { useSettings } from '@/hooks/useSettings';
import ScriptureHeader from '@/components/scripture/ScriptureHeader';
import ScriptureSearch from '@/components/scripture/ScriptureSearch';
import SettingsPanel from '@/components/scripture/SettingsPanel';
import ScriptureNavigation from '@/components/scripture/ScriptureNavigation';
import PageNavigation from '@/components/scripture/PageNavigation';
import PageLayout from '@/components/PageLayout';

const ScriptureReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'original' | 'explanation'>('explanation');
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
  const { settings } = useSettings();
  
  const [fontSize, setFontSize] = useState(settings?.font_size ?? 16);
  const [fontFamily, setFontFamily] = useState<'gothic' | 'serif'>(settings?.font_family as 'gothic' | 'serif' ?? 'gothic');
  const [theme, setTheme] = useState<'light' | 'dark'>(settings?.theme as 'light' | 'dark' ?? 'light');
  
  const { progress, updateProgress } = useScriptureProgress(scripture?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (scripture && progress) {
      setCurrentChapterIndex(scripture.chapters.findIndex(ch => ch.id === progress.last_chapter_id));
      setCurrentPageIndex(progress.last_page || 0);
    }
  }, [scripture, progress]);

  useEffect(() => {
    if (scripture) {
      const progress = ((currentChapterIndex * 100) / scripture.chapters.length) + 
                      ((currentPageIndex * 100) / 10) / scripture.chapters.length;
      
      const currentChapter = scripture.chapters[currentChapterIndex];
      updateProgress({
        progress: Math.floor(progress),
        last_chapter_id: currentChapter.id,
        last_chapter_title: currentChapter.title,
        last_page: currentPageIndex
      });
    }
  }, [currentChapterIndex, currentPageIndex, scripture, updateProgress]);

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
    
    const resultItem = searchResults[index];
    if (resultItem) {
      setTimeout(() => {
        const elements = document.querySelectorAll('.search-highlight');
        if (elements.length > index) {
          elements[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  };

  const handleNavigateToCalendar = () => {
    navigate('/calendar');
  };

  const handleNavigateToBookmark = () => {
    navigate('/bookmarks');
  };

  const renderContent = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{scripture.chapters[currentChapterIndex].title}</h2>
        <div className="space-y-4">
          {activeTab === 'original' ? (
            <div>
              {/* 원문 내용 */}
              <p>원문 내용이 여기에 표시됩니다.</p>
            </div>
          ) : (
            <div>
              {/* 해설 내용 */}
              <p>해설 내용이 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen" onClick={toggleControls}>
      {showControls && (
        <ScriptureHeader
          title={scripture.title}
          onBack={() => navigate(-1)}
          onShare={() => {}}
          onCalendar={handleNavigateToCalendar}
          onSettings={() => setShowSettings(!showSettings)}
          onSearch={toggleSearch}
        />
      )}

      {showSearch && (
        <ScriptureSearch
          query={searchQuery}
          onQueryChange={handleSearchQueryChange}
          results={searchResults}
          currentIndex={currentSearchIndex}
          onNavigate={navigateSearchResult}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          fontFamily={fontFamily}
          onFontFamilyChange={setFontFamily}
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div 
        ref={contentRef}
        className={`min-h-screen pt-16 pb-24 transition-all duration-300 ease-in-out bg-white text-gray-800`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {renderContent()}
      </div>

      {showControls && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex-1 text-center">
              <button
                onClick={toggleChapterDropdown}
                className="px-4 py-2 rounded-full bg-gray-100 inline-flex items-center"
              >
                <span className="mr-2">
                  {currentChapterIndex + 1}/{scripture.chapters.length} 장
                </span>
              </button>
              
              {showChapterDropdown && (
                <div className="absolute bottom-24 left-0 right-0 bg-white border border-gray-200 rounded-t-xl p-4 max-h-80 overflow-y-auto">
                  <h3 className="font-bold mb-2">장 선택</h3>
                  <div className="space-y-2">
                    {scripture.chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => selectChapter(index)}
                        className={`w-full text-left p-2 rounded ${
                          index === currentChapterIndex ? 'bg-gray-100 font-bold' : ''
                        }`}
                      >
                        {index + 1}. {chapter.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleNextPage}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
