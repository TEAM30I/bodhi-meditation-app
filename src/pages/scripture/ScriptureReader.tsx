import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Bookmark, Settings } from 'lucide-react';
import { scriptures, scriptureCategories } from '@/data/scriptureRepository';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import BookmarkList from '@/components/scripture/BookmarkList';

const ScriptureReader = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeView, setActiveView] = useState<'reading' | 'bookmark'>('reading');
  const [activeCategory, setActiveCategory] = useState('original');
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const scripture = scriptures.find(s => s.id === id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!scripture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>경전을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const paragraphs = scripture.content.split('\n').filter(p => p.trim());
  
  const charactersPerPage = Math.floor(6000 / fontSize);
  const totalCharacters = paragraphs.join('').length;
  const totalPages = Math.ceil(totalCharacters / charactersPerPage);
  
  const startCharIndex = (currentPage - 1) * charactersPerPage;
  const endCharIndex = Math.min(startCharIndex + charactersPerPage, totalCharacters);
  
  let currentPageContent = '';
  let charCount = 0;
  let pageContent = [];
  
  for (const paragraph of paragraphs) {
    if (charCount + paragraph.length < startCharIndex) {
      charCount += paragraph.length;
      continue;
    }
    
    if (charCount >= endCharIndex) break;
    
    let paragraphContent;
    
    if (charCount < startCharIndex) {
      const offset = startCharIndex - charCount;
      paragraphContent = paragraph.slice(offset);
    } else if (charCount + paragraph.length > endCharIndex) {
      const remaining = endCharIndex - charCount;
      paragraphContent = paragraph.slice(0, remaining);
    } else {
      paragraphContent = paragraph;
    }
    
    pageContent.push(paragraphContent);
    charCount += paragraph.length;
  }
  
  const handleBackClick = () => {
    navigate('/scripture');
  };

  const handleBookmarkClick = () => {
    if (activeView === 'reading') {
      setActiveView('bookmark');
    } else {
      setActiveView('reading');
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleHomeClick = () => {
    navigate('/main');
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className={`min-h-screen pb-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {activeView === 'reading' ? (
        <>
          <div className={`sticky top-0 z-10 w-full px-6 py-4 flex items-center border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button 
              onClick={handleBackClick}
              className="mr-4"
            >
              <ArrowLeft size={24} className={darkMode ? 'text-white' : 'text-black'} />
            </button>
            
            <div className="flex-1">
              <h1 className="text-lg font-bold flex items-center">
                {scripture.title}
              </h1>
            </div>

            <button 
              onClick={handleHomeClick}
              className="ml-4"
            >
              <Home size={24} className={darkMode ? 'text-white' : 'text-black'} />
            </button>
          </div>
          
          <div className={`px-6 py-3 flex space-x-2 overflow-x-auto ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-b'}`}>
            {scriptureCategories.map((category) => (
              <Badge
                key={category.id}
                variant={category.id === activeCategory ? "default" : "outline"}
                className={`rounded-full px-4 py-1 cursor-pointer ${
                  category.id === activeCategory 
                    ? darkMode ? "bg-gray-100 text-gray-900" : "bg-black text-white" 
                    : darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
          
          <div className={`px-6 py-4 relative ${darkMode ? 'bg-gray-900' : 'bg-white'}`} style={{ fontSize: `${fontSize}px`, minHeight: 'calc(100vh - 180px)' }}>
            <h2 className="font-bold text-lg mb-4">1. 개경 (開經) - {currentPage}/{totalPages} 페이지</h2>
            {pageContent.map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="flex justify-between mt-8 pb-16">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${currentPage === 1 ? 'text-gray-400' : darkMode ? 'text-white' : 'text-black'}`}
              >
                이전 페이지
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'text-gray-400' : darkMode ? 'text-white' : 'text-black'}`}
              >
                다음 페이지
              </button>
            </div>

            <div className="fixed bottom-32 right-6 flex flex-col gap-2">
              <button 
                onClick={handleBookmarkClick} 
                className={`p-3 rounded-full shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
              >
                <Bookmark size={24} className={darkMode ? 'text-white' : 'text-black'} />
              </button>
              <button 
                onClick={handleSettingsToggle} 
                className={`p-3 rounded-full shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
              >
                <Settings size={24} className={darkMode ? 'text-white' : 'text-black'} />
              </button>
            </div>

            {showSettings && (
              <div className={`fixed bottom-20 right-6 w-64 p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h3 className="text-lg font-medium mb-4">설정</h3>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">글자 크기: {fontSize}px</label>
                  <Slider
                    defaultValue={[fontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                    className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">다크 모드</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={darkMode} 
                      onChange={() => setDarkMode(!darkMode)} 
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${darkMode ? 'bg-blue-600' : 'bg-gray-200'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="px-6 py-4">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setActiveView('reading')}
              className="mr-4"
            >
              <ArrowLeft size={24} className={darkMode ? 'text-white' : 'text-black'} />
            </button>
            <h1 className="text-lg font-bold">북마크</h1>
          </div>
          <BookmarkList scriptureId={id} />
        </div>
      )}
    </div>
  );
};

export default ScriptureReader;
