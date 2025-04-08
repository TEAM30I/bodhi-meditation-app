
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Share2, Bookmark, Home } from 'lucide-react';
import { scriptures, scriptureCategories } from '@/data/scriptureRepository';
import { Badge } from '@/components/ui/badge';
import ScriptureBookmarkList from './ScriptureBookmarkList';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const ScriptureReadingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState('original');
  const [fontSize, setFontSize] = useState(16);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [darkMode, setDarkMode] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 경전 데이터 찾기
  const scripture = scriptures.find(s => s.id === id);
  
  useEffect(() => {
    // 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  if (!scripture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>경전을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 경전 내용을 단락으로 분리
  const paragraphs = scripture.content.split('\n').filter(p => p.trim());
  
  // Calculate total pages based on font size and content
  const calculateTotalPages = () => {
    if (!contentRef.current) return 1;
    
    const contentHeight = contentRef.current.scrollHeight;
    const viewportHeight = window.innerHeight - 200; // Adjust for header and other UI
    const linesPerPage = Math.floor(viewportHeight / (fontSize * lineSpacing));
    const totalLines = paragraphs.length * 3; // Rough estimate
    return Math.ceil(totalLines / linesPerPage);
  };
  
  const handleBackClick = () => {
    navigate('/scripture');
  };

  const toggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowBookmarks(false);
  };
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 w-full px-6 py-4 flex items-center border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <button 
          onClick={handleBackClick}
          className="mr-4"
        >
          <ArrowLeft size={24} className={darkMode ? 'text-white' : 'text-black'} />
        </button>
        
        <div className="flex-1">
          <h1 className="text-lg font-bold flex items-center">
            {scripture.title}
            <ChevronDown className="ml-1 h-5 w-5" />
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleBookmarks}>
            <Bookmark size={20} className={showBookmarks ? 'text-orange-500' : darkMode ? 'text-white' : 'text-black'} />
          </button>
          <button onClick={toggleSettings}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={darkMode ? '#ffffff' : '#000000'} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button onClick={() => navigate('/main')}>
            <Home size={20} className={darkMode ? 'text-white' : 'text-black'} />
          </button>
        </div>
      </div>
      
      {/* Categories */}
      {!showBookmarks && !showSettings && (
        <div className={`px-6 py-3 flex space-x-2 overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {scriptureCategories.map((category) => (
            <Badge
              key={category.id}
              variant={category.id === activeCategory ? "default" : "outline"}
              className={`rounded-full px-4 py-1 cursor-pointer ${
                category.id === activeCategory 
                  ? darkMode ? "bg-gray-600 text-white" : "bg-black text-white"
                  : darkMode ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-white text-black border-gray-300"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Settings Slider */}
      {showSettings && (
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>글자 크기</label>
              <div className="flex items-center space-x-4">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>A</span>
                <Slider
                  value={[fontSize]}
                  min={12}
                  max={24}
                  step={1}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="flex-1"
                />
                <span className={`text-base font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>A</span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>현재: {fontSize}px</p>
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>줄 간격</label>
              <div className="flex items-center space-x-4">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>좁게</span>
                <Slider
                  value={[lineSpacing * 10]}
                  min={10}
                  max={30}
                  step={1}
                  onValueChange={(value) => setLineSpacing(value[0] / 10)}
                  className="flex-1"
                />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>넓게</span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>현재: {lineSpacing}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>다크 모드</span>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Bookmarks */}
      {showBookmarks && (
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ScriptureBookmarkList />
        </div>
      )}
      
      {/* Scripture Content */}
      {!showBookmarks && !showSettings && (
        <div 
          ref={contentRef}
          className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} 
          style={{ fontSize: `${fontSize}px`, lineHeight: lineSpacing }}
        >
          <h2 className={`font-bold text-lg mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            1. 개경 (開經)
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4" style={{ lineHeight: `${lineSpacing * 1.5}` }}>
              {paragraph}
            </p>
          ))}
          <div className="text-right text-sm text-gray-500 mt-8">
            페이지 1 / {calculateTotalPages()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptureReadingPage;
