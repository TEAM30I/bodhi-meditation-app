
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { Scripture } from '../../../public/data/scriptureData/scriptureRepository';

interface ScriptureHeaderProps {
  scripture: Scripture;
  currentChapterIndex: number;
  showChapterDropdown: boolean;
  toggleChapterDropdown: (e: React.MouseEvent) => void;
  selectChapter: (index: number) => void;
  toggleSearch: (e: React.MouseEvent) => void;
  theme: 'light' | 'dark';
}

const ScriptureHeader = ({
  scripture,
  currentChapterIndex,
  showChapterDropdown,
  toggleChapterDropdown,
  selectChapter,
  toggleSearch,
  theme,
}: ScriptureHeaderProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/scripture');
  };

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <button onClick={handleBackClick}>
            <ArrowLeft size={28} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </button>
          <div 
            className="flex items-center cursor-pointer"
            onClick={toggleChapterDropdown}
          >
            <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {scripture.title}
            </span>
            <ChevronDown size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleSearch}>
            <Search size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </button>
        </div>
      </div>
      
      {showChapterDropdown && (
        <div 
          className={`absolute z-50 mt-1 w-64 rounded-md shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {scripture.chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  theme === 'dark' 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                } ${currentChapterIndex === index ? 'font-bold' : ''}`}
                onClick={() => selectChapter(index)}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptureHeader;
