
import React from 'react';
import { Book, Calendar, Bookmark, Share2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, isActive, onClick }: NavItemProps) => (
  <button
    className={`flex items-center justify-center w-16 h-16 ${isActive ? 'text-[#DE7834]' : 'text-gray-400'}`}
    onClick={onClick}
  >
    <div className="h-6">{icon}</div>
  </button>
);

interface ScriptureBottomNavProps {
  activeTab?: 'calendar' | 'bookmark' | 'share' | 'settings' | null;
  onTabChange: (tab: 'calendar' | 'bookmark' | 'share' | 'settings') => void;
}

const ScriptureBottomNav: React.FC<ScriptureBottomNavProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const navigate = useNavigate();
  
  const handleCalendarClick = () => {
    navigate('/scripture/calendar');
  };
  
  const handleBookmarkClick = () => {
    navigate('/scripture/bookmarks');
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-10">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto">
        <NavItem
          icon={<Calendar size={24} />}
          isActive={activeTab === 'calendar'}
          onClick={handleCalendarClick}
        />
        <NavItem
          icon={<Bookmark size={24} />}
          isActive={activeTab === 'bookmark'}
          onClick={handleBookmarkClick}
        />
        <NavItem
          icon={<Share2 size={24} />}
          isActive={activeTab === 'share'}
          onClick={() => onTabChange('share')}
        />
        <NavItem
          icon={<Settings size={24} />}
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </div>
    </div>
  );
};

export default ScriptureBottomNav;
