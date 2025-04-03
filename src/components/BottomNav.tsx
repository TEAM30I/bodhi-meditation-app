
import React from 'react';
import { Home, Search, MapPin, Heart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center gap-1 cursor-pointer"
      onClick={onClick}
    >
      <div className={isActive ? "text-bodhi-orange" : "text-[#1D1B20]"}>
        {icon}
      </div>
      <span className="text-[10px] font-medium leading-[15px] text-[#222]">
        {label}
      </span>
    </div>
  );
};

interface BottomNavProps {
  activeTab: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 w-full max-w-[390px] bg-white border border-[#E6E6E6] z-10">
      <div className="flex justify-around items-center py-[15px]">
        <NavItem 
          icon={<Home size={19} />} 
          label="홈" 
          isActive={activeTab === 'home'}
          onClick={() => navigate('/main')}
        />
        <NavItem 
          icon={<Search size={21} />} 
          label="검색" 
          isActive={activeTab === 'search'}
          onClick={() => navigate('/search')}
        />
        <NavItem 
          icon={<MapPin size={21} />} 
          label="주변" 
          isActive={activeTab === 'nearby'}
          onClick={() => navigate('/nearby')}
        />
        <NavItem 
          icon={<Heart size={21} />} 
          label="찜 목록" 
          isActive={activeTab === 'favorites'}
          onClick={() => navigate('/favorites')}
        />
        <NavItem 
          icon={<User size={21} />} 
          label="내 정보" 
          isActive={activeTab === 'profile'}
          onClick={() => navigate('/profile')}
        />
      </div>
    </div>
  );
};

export default BottomNav;
