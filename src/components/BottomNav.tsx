
import { useNavigate } from 'react-router-dom';
import { Home, Book, Search, Heart, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button 
      className={`flex flex-col items-center text-sm ${isActive ? 'text-[#dd7733]' : 'text-gray-500'}`} 
      onClick={onClick}
    >
      {icon}
      <span className="mt-1 text-[10px] md:text-xs">{label}</span>
    </button>
  );
};

const BottomNav = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  
  // Define pathnames for the main sections
  const isWishlistPath = pathname === '/wishlist' || pathname.startsWith('/modules/wishlist');
  const isScripturePath = pathname === '/scripture' || pathname.startsWith('/modules/scripture');
  const isSearchPath = pathname.includes('/search');
  const isProfilePath = pathname === '/profile' || pathname.startsWith('/modules/profile');
  
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-[#E6E6E6] z-10">
      <div className="max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto flex justify-around items-center py-3 sm:py-4">
        <NavItem 
          icon={<Home size={20} />} 
          label="홈" 
          isActive={pathname === '/main' || pathname === '/'}
          onClick={() => navigate('/main')}
        />
        <NavItem 
          icon={<Book size={20} />} 
          label="읽기" 
          isActive={isScripturePath}
          onClick={() => navigate('/scripture')}
        />
        <NavItem 
          icon={<Search size={20} />} 
          label="검색" 
          isActive={isSearchPath}
          onClick={() => navigate('/search')}
        />
        <NavItem 
          icon={<Heart size={20} />} 
          label="찜" 
          isActive={isWishlistPath}
          onClick={() => navigate('/wishlist')}
        />
        <NavItem 
          icon={<User size={20} />} 
          label="내 정보" 
          isActive={isProfilePath}
          onClick={() => navigate('/profile')}
        />
      </div>
    </div>
  );
};

export default BottomNav;
