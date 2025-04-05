
import React from 'react';
import { CalendarDays, Bookmark, Share2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, text, isActive, onClick }: NavItemProps) => (
  <button
    className={`flex flex-col items-center justify-center space-y-1 ${isActive ? 'text-black' : 'text-gray-400'}`}
    onClick={onClick}
  >
    <div className="h-6">{icon}</div>
    <span className="text-xs">{text}</span>
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
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-10">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto">
        <NavItem
          icon={<CalendarDays size={24} />}
          text="캘린더"
          isActive={activeTab === 'calendar'}
          onClick={() => onTabChange('calendar')}
        />
        <NavItem
          icon={<Bookmark size={24} />}
          text="북마크"
          isActive={activeTab === 'bookmark'}
          onClick={() => onTabChange('bookmark')}
        />
        <NavItem
          icon={<Share2 size={24} />}
          text="공유"
          isActive={activeTab === 'share'}
          onClick={() => onTabChange('share')}
        />
        <NavItem
          icon={<Settings size={24} />}
          text="설정"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </div>
    </div>
  );
};

export default ScriptureBottomNav;
