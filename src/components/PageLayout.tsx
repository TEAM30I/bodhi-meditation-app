
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showBackButton = true,
  showBottomNav = true,
  className = '',
}) => {
  const navigate = useNavigate();

  // 페이지 접속 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      <div className="w-full max-w-[1024px] mx-auto flex flex-col items-center">
        <div className="w-full max-w-[390px] md:max-w-[768px] lg:max-w-[1024px] px-[24px] pt-[42px] pb-[80px] relative">
          {/* Header with title and back button */}
          {title && (
            <div className="w-full relative h-[73px]">
              <h1 className="font-bold text-[#2b2828] text-base tracking-[0.32px] text-center py-6">
                {title}
              </h1>
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute w-[23px] h-[23px] top-6 left-6 p-0"
                  onClick={() => navigate('/main')}
                >
                  <ArrowLeft className="w-[23px] h-[23px]" />
                </Button>
              )}
            </div>
          )}
          
          {/* Page content */}
          <div className={`w-full ${className}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default PageLayout;
