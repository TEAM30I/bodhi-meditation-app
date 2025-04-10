import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Share2, ChevronLeft, ChevronRight, ChevronDown, Calendar, Home } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { getScriptureById, Scripture } from '../../../public/data/scriptureData/scriptureRepository';
import SettingsPanel from '@/components/scripture/SettingsPanel';

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

  // If showShare is true, render the share screen
  if (showShare) {
    return (
      <div className={`min-h-screen ${contentClasses}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <button onClick={() => setShowShare(false)}>
            <ArrowLeft size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </button>
          <h1 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            공유하기
          </h1>
          <button onClick={handleHomeClick}>
            <Home size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <ShareOption 
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13C10.4295 13 10.8388 13.1321 11.1679 13.3634C11.497 13.5947 11.7274 13.9118 11.8247 14.2729C11.922 14.634 11.8811 15.0142 11.7075 15.3509C11.5339 15.6877 11.2384 15.9613 10.8701 16.1226L10.7336 16.1784L10.7336 16.1784C10.5125 16.2648 10.2747 16.3112 10.0343 16.315C9.79388 16.3188 9.55443 16.28 9.32962 16.2006C9.10481 16.1212 8.8988 16.0028 8.72373 15.8515C8.54866 15.7002 8.4075 15.519 8.30765 15.3181C8.20781 15.1173 8.15114 14.9009 8.14107 14.6811C8.131 14.4613 8.16773 14.2415 8.24926 14.0335C8.3308 13.8256 8.45562 13.6339 8.61651 13.4701C8.7774 13.3064 8.97107 13.1737 9.18723 13.0785L9.3 13.023C9.52155 12.9346 9.75934 12.8881 10 12.8881C10.2407 12.8881 10.4784 12.9346 10.7 13.023L10.8128 13.0785C11.0289 13.1737 11.2226 13.3064 11.3835 13.4701C11.5444 13.6339 11.6692 13.8256 11.7507 14.0335C11.8323 14.2415 11.869 14.4613 11.8589 14.6811C11.8489 14.9009 11.7922 15.1173 11.6923 15.3181C11.5925 15.519 11.4513 15.7002 11.2763 15.8515C11.1012 16.0028 10.8952 16.1212 10.6704 16.2006C10.4456 16.28 10.2061 16.3188 9.96567 16.315C9.72526 16.3112 9.48751 16.2648 9.26637 16.1784L9.12991 16.1226C8.76157 15.9613 8.4661 15.6877 8.29251 15.3509C8.11892 15.0142 8.07796 14.634 8.17528 14.2729C8.2726 13.9118 8.50297 13.5947 8.8321 13.3634C9.16124 13.1321 9.57046 13 10 13ZM10 13L10 7M14 7C14.4295 7 14.8388 7.13211 15.1679 7.36338C15.497 7.59465 15.7274 7.91175 15.8247 8.27285C15.922 8.63395 15.8811 9.01417 15.7075 9.35093C15.5339 9.68769 15.2384 9.96127 14.8701 10.1226L14.7336 10.1784C14.5125 10.2648 14.2747 10.3112 14.0343 10.315C13.7939 10.3188 13.5544 10.28 13.3296 10.2006C13.1048 10.1212 12.8988 10.0028 12.7237 9.85151C12.5487 9.70022 12.4075 9.51896 12.3076 9.31812C12.2078 9.11727 12.1511 8.90093 12.1411 8.68112C12.131 8.4613 12.1677 8.24151 12.2493 8.03354C12.3308 7.82558 12.4556 7.63393 12.6165 7.47016C12.7774 7.30638 12.9711 7.17366 13.1872 7.07847L13.3 7.02304C13.5215 6.93465 13.7593 6.88806 14 6.88806C14.2407 6.88806 14.4784 6.93465 14.7 7.02304L14.8128 7.07847C15.0289 7.17366 15.2226 7.30638 15.3835 7.47016C15.5444 7.63393 15.6692 7.82558 15.7507 8.03354C15.8323 8.24151 15.869 8.4613 15.8589 8.68112C15.8489 8.90093 15.7922 9.11727 15.6923 9.31812C15.5925 9.51896 15.4513 9.70022 15.2763 9.85151C15.1012 10.0028 14.8952 10.1212 14.6704 10.2006C14.4456 10.28 14.2061 10.3188 13.9657 10.315C13.7253 10.3112 13.4875 10.2648 13.2664 10.1784L13.1299 10.1226C12.7616 9.96127 12.4661 9.68769 12.2925 9.35093C12.1189 9.01417 12.078 8.63395 12.1753 8.27285C12.2726 7.91175 12.503 7.59465 12.8321 7.36338C13.1612 7.13211 13.5705 7 14 7ZM14 7L14 11M6 11C6.42954 11 6.83876 11.1321 7.1679 11.3634C7.49703 11.5947 7.7274 11.9118 7.82472 12.2729C7.92204 12.634 7.88108 13.0142 7.70749 13.3509C7.5339 13.6877 7.23843 13.9613 6.87009 14.1226L6.73363 14.1784C6.51249 14.2648 6.27474 14.3112 6.03433 14.315C5.7939 14.3188 5.55443 14.28 5.32962 14.2006C5.10481 14.1212 4.8988 14.0028 4.72373 13.8515C4.54866 13.7002 4.4075 13.519 4.30765 13.3181C4.20781 13.1173 4.15114 12.9009 4.14107 12.6811C4.131 12.4613 4.16773 12.2415 4.24926 12.0335C4.3308 11.8256 4.45562 11.6339 4.61651 11.4701C4.7774 11.3064 4.97107 11.1737 5.18723 11.0785L5.3 11.023C5.52155 10.9346 5.75934 10.8881 6 10.8881C6.24065 10.8881 6.47844 10.9346 6.7 11.023L6.81277 11.0785C7.02893 11.1737 7.2226 11.3064 7.38349 11.4701C7.54438 11.6339 7.6692 11.8256 7.75074 12.0335C7.83227 12.2415 7.869 12.4613 7.85893 12.6811C7.84886 12.9009 7.79219 13.1173 7.69235 13.3181C7.5925 13.519 7.45134 13.7002 7.27627 13.8515C7.1012 14.0028 6.89519 14.1212 6.67038 14.2006C6.44557 14.28 6.2061 14.3188 5.96567 14.315C5.72526 14.3112 5.48751 14.2648 5.26637 14.1784L5.12991 14.1226C4.76157 13.9613 4.4661 13.6877 4.29251 13.3509C4.11892 13.0142 4.07796 12.634 4.17528 12.2729C4.2726 11.9118 4.50297 11.5947 4.8321 11.3634C5.16124 11.1321 5.57046 11 6 11ZM6 11L6 7M18 7C18.4295 7 18.8388 7.13211 19.1679 7.36338C19.497 7.59465 19.7274 7.91175 19.8247 8.27285C19.922 8.63395 19.8811 9.01417 19.7075 9.35093C19.5339 9.68769 19.2384 9.96127 18.8701 10.1226L18.7336 10.1784C18.5125 10.2648 18.2747 10.3112 18.0343 10.315C17.7939 10.3188 17.5544 10.28 17.3296 10.2006C17.1048 10.1212 16.8988 10.0028 16.7237 9.85151C16.5487 9.70022 16.4075 9.51896 16.3076 9.31812C16.2078 9.11727 16.1511 8.90093 16.1411 8.68112C16.131 8.4613 16.1677 8.24151 16.2493 8.03354C16.3308 7.82558 16.4556 7.63393 16.6165 7.47016C16.7774 7.30638 16.9711 7.17366 17.1872 7.07847L17.3 7.02304C17.5215 6.93465 17.7593 6.88806 18 6.88806C18.2407 6.88806 18.4784 6.93465 18.7 7.02304L18.8128 7.07847C19.0289 7.17366 19.2226 7.30638 19.3835 7.47016C19.5444 7.63393 19.6692 7.82558 19.7507 8.03354C19.8323 8.24151 19.869 8.4613 19.8589 8.68112C19.8489 8.90093 19.7922 9.11727 19.6923 9.31812C19.5925 9.51896 19.4513 9.70022 19.2763 9.85151C19.1012 10.0028 18.8952 10.1212 18.6704 10.2006C18.4456 10.28 18.2061 10.3188 17.9657 10.315C17.7253 10.3112 17.4875 10.2648 17.2664 10.1784L17.1299 10.1226C16.7616 9.96127 16.4661 9.68769 16.2925 9.35093C16.1189 9.01417 16.078 8.63395 16.1753 8.27285C16.2726 7.91175 16.503 7.59465 16.8321 7.36338C17.1612 7.13211 17
