
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiButton from '@/components/BodhiButton';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-bodhi-background font-pretendard">
      <div className="flex flex-col items-center w-full max-w-[390px] px-[25px] pt-[171px]">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e6dc8e0c8b25a242255fb31e792ed2cd0ab85019" 
          alt="Cute Giraffe Meditation Yoga" 
          className="w-[220px] h-[220px] mb-[21px]"
        />
        
        <div className="text-[26px] font-bold text-bodhi-textDark text-center leading-[44px] tracking-[-0.65px] mb-[12px]">
          명상 어렵지 않아요
        </div>
        
        <div className="text-[14px] text-bodhi-darkGray text-center leading-[22px] tracking-[-0.35px] mb-[171px]">
          명상은 거창한 게 아니에요.<br />
          지금, 숨 쉬는 것부터 시작해보세요.
        </div>
        
        <div className="w-full flex flex-col gap-[14px]">
          <BodhiButton 
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            로그인
          </BodhiButton>
          
          <BodhiButton 
            variant="primary"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </BodhiButton>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
