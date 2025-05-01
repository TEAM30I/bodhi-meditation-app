
import { useNavigate } from 'react-router-dom';
import { Book, Search, Heart, User, Home } from 'lucide-react';

interface NavItemProps {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button 
      className={`flex flex-col items-center justify-center ${isActive ? 'text-[#DE7834]' : 'text-[#111111]'}`} 
      onClick={onClick}
    >
      <div className={`${isActive ? 'text-[#DE7834] fill-[#DE7834]' : 'text-[#111111]'}`}>
        {icon}
      </div>
      <span className="mt-1 text-[10px] md:text-xs font-medium">{label}</span>
    </button>
  );
};

const BottomNav = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  
  // Define pathnames for the main sections
  const isHomePath = pathname === '/main';
  const isWishlistPath = pathname.startsWith('/wishlist');
  const isScripturePath = pathname.startsWith('/scripture');
  const isSearchPath = pathname.includes('/search');
  const isProfilePath = pathname.startsWith('/profile');
  
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-[#E5E5EC] z-10">
      <div className="max-w-[480px] mx-auto">
        <div className="flex justify-between items-center px-6 h-[64px]">
          <NavItem 
            icon={<Home size={28} className={isHomePath ? "fill-[rgba(222,120,52,0.2)] stroke-[#DE7834]" : ""} />}
            label="홈" 
            isActive={isHomePath}
            onClick={() => navigate('/main')}
          />
          <NavItem 
            icon={<Book size={28} className={isScripturePath ? "fill-[rgba(222,120,52,0.2)] stroke-[#DE7834]" : ""} />} 
            label="경전" 
            isActive={isScripturePath}
            onClick={() => navigate('/scripture')}
          />
          <NavItem 
            icon={<Search size={28} className={isSearchPath ? "fill-[rgba(222,120,52,0.2)] stroke-[#DE7834]" : ""} />} 
            label="검색" 
            isActive={isSearchPath}
            onClick={() => navigate('/search')}
          />
          <NavItem 
            icon={<Heart size={28} className={isWishlistPath ? "fill-[rgba(222,120,52,0.2)] stroke-[#DE7834]" : ""} />} 
            label="찜" 
            isActive={isWishlistPath}
            onClick={() => navigate('/wishlist')}
          />
          <NavItem 
            icon={<User size={28} className={isProfilePath ? "fill-[rgba(222,120,52,0.2)] stroke-[#DE7834]" : ""} />} 
            label="마이페이지" 
            isActive={isProfilePath}
            onClick={() => navigate('/profile')}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
