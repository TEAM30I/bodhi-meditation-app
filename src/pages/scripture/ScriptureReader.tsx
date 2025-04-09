
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Settings, Search, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { scriptures, scriptureCategories } from '@/data/scriptureData';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const ScriptureReader = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'original' | 'translation'>('original');
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.6);
  
  const scripture = scriptures.find(s => s.id === id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#111]' : 'bg-[#F5F5F5]'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 w-full h-[56px] flex items-center px-5 ${darkMode ? 'bg-[#111] border-gray-800' : 'bg-white border-b border-[#E5E5EC]'}`}>
        <button onClick={handleBackClick} className="mr-2">
          <ArrowLeft size={22} className={darkMode ? 'text-white' : 'text-black'} />
        </button>
        
        <div className="flex-1 flex items-center">
          <h1 className={`text-base font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
            {scripture.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button>
            <Bookmark size={20} className={darkMode ? 'text-white' : 'text-black'} />
          </button>
          <button>
            <Search size={20} className={darkMode ? 'text-white' : 'text-black'} />
          </button>
        </div>
      </div>
      
      {/* Tab switcher */}
      <div className={`w-full flex ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'original' 
              ? darkMode ? 'bg-[#333] text-white' : 'bg-[#111] text-white' 
              : darkMode ? 'bg-[#111] text-gray-400' : 'bg-white text-gray-500'
          }`}
          onClick={() => setActiveTab('original')}
        >
          원문
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'translation' 
              ? darkMode ? 'bg-[#333] text-white' : 'bg-[#111] text-white' 
              : darkMode ? 'bg-[#111] text-gray-400' : 'bg-white text-gray-500'
          }`}
          onClick={() => setActiveTab('translation')}
        >
          해설문
        </button>
      </div>
      
      {/* Content */}
      <div 
        className={`p-5 ${darkMode ? 'bg-[#111] text-white' : 'bg-white text-black'}`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight
        }}
      >
        <h2 className="font-bold text-lg mb-4">1. 개경 (開經)</h2>
        {pageContent.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
        
        {/* Page navigation */}
        <div className="flex justify-between items-center mt-8 mb-20">
          <button 
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            } ${currentPage === 1 ? 'opacity-50' : ''}`}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={24} />
          </button>
          
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentPage} / {totalPages}
          </span>
          
          <button 
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            } ${currentPage === totalPages ? 'opacity-50' : ''}`}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-black/80' : 'bg-black/50'}`} onClick={() => setShowSettings(false)}>
          <div 
            className={`absolute bottom-0 left-0 right-0 p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
              경전 설정
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  글자 크기: {fontSize}px
                </label>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>작게</span>
                  <Slider
                    defaultValue={[fontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
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
                  <Slider
                    defaultValue={[lineHeight * 10]}
                    min={10}
                    max={25}
                    step={1}
                    onValueChange={(value) => setLineHeight(value[0] / 10)}
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
                  <div className={`w-11 h-6 rounded-full peer ${darkMode ? 'bg-orange-600' : 'bg-gray-200'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
              
              <button
                className={`w-full py-3 rounded-lg ${
                  darkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
                } font-medium`}
                onClick={() => setShowSettings(false)}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 h-16 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-around px-6`}>
        <button 
          className="flex flex-col items-center"
          onClick={() => navigate('/scripture/calendar')}
        >
          <CalendarDays size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
          <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>캘린더</span>
        </button>
        
        <button 
          className="flex flex-col items-center"
          onClick={() => navigate(`/scripture/bookmarks?scripture=${id}`)}
        >
          <Bookmark size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
          <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>북마크</span>
        </button>
        
        <button 
          className="flex flex-col items-center"
        >
          <Share2 size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
          <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>공유</span>
        </button>
        
        <button 
          className="flex flex-col items-center"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
          <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>설정</span>
        </button>
      </div>
    </div>
  );
};

export default ScriptureReader;
