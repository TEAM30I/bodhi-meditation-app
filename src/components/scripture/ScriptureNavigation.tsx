
import React from 'react';
import { Calendar, Share2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScriptureNavigationProps {
  theme: 'light' | 'dark';
  onSettingsClick: (e: React.MouseEvent) => void;
  showControls: boolean;
}

const ScriptureNavigation: React.FC<ScriptureNavigationProps> = ({
  theme,
  onSettingsClick,
  showControls
}) => {
  const navigate = useNavigate();
  
  const handleNavigateToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/scripture/calendar');
  };
  
  const handleNavigateToBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/scripture/bookmarks');
  };
  
  return (
    <div className={`fixed bottom-10 left-0 right-0 flex justify-center ${showControls ? '' : 'hidden'}`}>
      <div className={`flex items-center justify-between px-3 h-14 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md shadow-lg rounded-full mx-8`}>
        <button 
          className="w-[67px] h-14 flex items-center justify-center"
          onClick={handleNavigateToCalendar}
        >
          <Calendar size={28} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        
        <button 
          className="w-[67px] h-14 flex items-center justify-center"
          onClick={handleNavigateToBookmark}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" 
              stroke={theme === 'dark' ? "#FFFFFF" : "#111111"} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <button 
          className="w-[67px] h-14 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 size={28} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        
        <button 
          className="w-[67px] h-14 flex items-center justify-center"
          onClick={onSettingsClick}
        >
          <Settings size={28} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
      </div>
    </div>
  );
};

export default ScriptureNavigation;
