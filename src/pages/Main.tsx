import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BottomNav from '@/components/BottomNav';
import TempleBanner from '@/components/TempleBanner';
import TempleCircle from '@/components/TempleCircle';
import NewsItem from '@/components/NewsItem';
import IconMenu from '@/components/IconMenu';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Main = () => {
  console.log('Main 컴포넌트 렌더링');
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // 간단한 로딩 상태
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Main 컴포넌트 마운트됨');
    
    // 잠시 후 로딩 상태 해제
    const timer = setTimeout(() => {
      setLoading(false);
      console.log('Main 컴포넌트 로딩 완료');
    }, 500);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for the icon menu
  const iconMenuItems = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f9634e0cca626d9a904e87a56fa4b9e54f423808",
      label: "오늘의 운세",
      onClick: () => navigate('/fortune')
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ec3def58b7540a2b54f8f5fdcdea89b6f0e64824",
      label: "템플 스테이",
      onClick: () => navigate('/temple-stay')
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d3d60511456bf29305fe928345308ba6f90cace3",
      label: "선명상",
      onClick: () => navigate('/meditation')
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2f87545372fe9582fde4b5e3604644d1ec5ec5d",
      label: "사찰 찾기",
      onClick: () => navigate('/find-temple')
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e9b244bfeb4fce8c1bb15a185dcc29fbf805b686",
      label: "더보기",
      onClick: () => navigate('/more')
    }
  ];

  // Mock data for temples
  const temples = [
    { name: "불국사" },
    { name: "해인사" },
    { name: "미륵사" },
    { name: "송광사" },
    { name: "법주사" }
  ];

  // Mock data for news
  const newsItems = [
    { temple: "조계사", source: "불교신문", title: "부처님오신날 특별 법회 일정 안내" },
    { temple: "봉은사", source: "연합뉴스", title: "전통 사찰 문화 체험 행사 개최" },
    { temple: "미륵사", source: "유튜브", title: "천년 고찰의 비밀, 미륵사의 유래" },
    { temple: "송광사", source: "송광사 - 네이버 블로그", title: "힐링이 필요할 땐, 송광사 템플스테이 후기" },
    { temple: "해인사", source: "통도사 - 인스타그램", title: "오늘의 풍경, 봄꽃이 만개한 사찰의 모습" }
  ];

  const handleLogout = async () => {
    try {
      document.body.style.cursor = 'wait'; // 커서를 대기 상태로 변경
      await logout();
      toast({
        title: "로그아웃 성공",
        description: "안전하게 로그아웃되었습니다.",
      });
      // replace로 히스토리 대체 (뒤로가기 방지)
      window.location.replace('/login');
    } catch (error) {
      document.body.style.cursor = 'default'; // 커서를 기본 상태로 복원
      console.error('로그아웃 에러:', error);
      toast({
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[24px] pt-[42px] pb-[80px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-[40px]">
            <BodhiLogo />
            {user ? (
              <div className="flex items-center">
                <div className="text-sm text-bodhi-darkOrange mr-2">
                  {user.email}
                </div>
                <div 
                  className="rounded-[7px] border border-[#DF7D7F] px-[12px] py-[5px] cursor-pointer"
                  onClick={handleLogout}
                >
                  <span className="text-bodhi-orange text-[10px] font-pretendard leading-[22px] tracking-[0.2px]">
                    로그아웃
                  </span>
                </div>
              </div>
            ) : (
              <div 
                className="rounded-[7px] border border-[#DF7D7F] px-[12px] py-[5px] cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <span className="text-bodhi-orange text-[10px] font-pretendard leading-[22px] tracking-[0.2px]">
                  로그인/회원가입
                </span>
              </div>
            )}
          </div>

          {/* Icon Menu */}
          <div className="w-full bg-white shadow-[0px_2px_10px_rgba(0,0,0,0.11)] py-[22px] mb-[29px]">
            <IconMenu items={iconMenuItems} />
          </div>

          {/* Banner */}
          <TempleBanner className="mb-[22px]" />

          {/* Popular Temples Section */}
          <div className="flex justify-between items-center mb-[18px]">
            <div className="text-[17px] font-bold leading-[24px] tracking-[-0.425px]">
              <span className="text-bodhi-darkOrange">인기 사찰</span>
              <span>탐방</span>
            </div>
            <div className="flex items-center text-bodhi-textLight cursor-pointer">
              <span className="text-[13px] font-bold leading-[24px] tracking-[-0.325px]">더보기</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z" fill="#8B8B8B"/>
              </svg>
            </div>
          </div>

          {/* Temple Circles */}
          <div className="flex gap-[18px] overflow-x-auto pb-[20px]">
            {temples.map((temple, index) => (
              <TempleCircle key={index} name={temple.name} />
            ))}
          </div>

          {/* News Section */}
          <div className="bg-[rgba(203,203,203,0.30)] rounded-[10px_10px_0px_0px] p-[15px]">
            <div className="flex flex-col gap-[28px]">
              {newsItems.map((item, index) => (
                <NewsItem
                  key={index}
                  temple={item.temple}
                  source={item.source}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Bottom Navigation */}
        <BottomNav />
    </div>
  );
};

export default Main;